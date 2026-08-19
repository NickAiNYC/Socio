import { test } from 'node:test';
import assert from 'node:assert/strict';

import { generateDeadLeadSequence, MARIA_SYSTEM_PROMPT } from '../construction/dead-lead-prompts.mjs';
import { matchHomeownerLead, DEFAULT_PILOT_ROSTER, normalizeTrade } from '../construction/homeowner-lead-router.mjs';
import { buildVictoryPingPayload } from '../construction/victory-ping.mjs';

test('MODULE 1: Dead Lead Prompts generate personalized 2-touch win-back sequences', () => {
  // Spanish sequence
  const seqEs = generateDeadLeadSequence({
    clientName: 'Don Hector',
    contractorOwnerName: 'Carlos Mendoza',
    contractorCompanyName: 'Mendoza Drywall Corp',
    projectScope: 'la remodelación de la cocina y el drywall',
    borough: 'Queens',
    lang: 'es',
  });

  assert.match(seqEs.touch_1, /María/);
  assert.match(seqEs.touch_1, /remodelación de la cocina/);
  assert.match(seqEs.touch_1, /se nos abrió un espacio con la cuadrilla/);
  assert.match(seqEs.touch_2, /cerrando el calendario de obras/);

  // English sequence
  const seqEn = generateDeadLeadSequence({
    clientName: 'Mr. Robert',
    contractorOwnerName: 'Carlos Mendoza',
    contractorCompanyName: 'Mendoza Drywall Corp',
    projectScope: 'the basement renovation and drywall framing',
    borough: 'Brooklyn',
    lang: 'en',
  });

  assert.match(seqEn.touch_1, /María/);
  assert.match(seqEn.touch_1, /basement renovation/);
  assert.match(seqEn.touch_1, /unexpected opening in our schedule/);
  assert.match(seqEn.touch_2, /finalizing the calendar/);

  // System prompt constraints check
  assert.match(MARIA_SYSTEM_PROMPT, /NEVER say "I am an AI"/);
  assert.match(MARIA_SYSTEM_PROMPT, /ZERO PRESSURE CTA/);
});

test('MODULE 2: Homeowner Routing Engine matches by Borough, Trade, and Round-Robin load balancing', () => {
  // Create fresh copy of roster
  const testPool = JSON.parse(JSON.stringify(DEFAULT_PILOT_ROSTER));

  // Lead 1: Queens Framing -> Alianza Framing
  const lead1 = matchHomeownerLead({
    homeownerName: 'Elena Rostova',
    homeownerPhone: '3475550183',
    borough: 'QUEENS',
    trade: 'FRAMING',
    projectAddress: '142 Bedford Ave',
    scopeDescription: 'Full framing and structural renovation',
    contractorPool: testPool,
  });

  assert.equal(lead1.assignedContractor.id, 'pilot_1'); // Alianza
  assert.equal(testPool[0].assignedLeadsCount, 1);
  assert.match(lead1.contractorWhatsAppAlert, /NUEVO PROPIETARIO ASIGNADO/);

  // Lead 2: Queens Framing -> Mendoza Drywall (Round-Robin next available)
  const lead2 = matchHomeownerLead({
    homeownerName: 'Mateo Delgado',
    homeownerPhone: '9175550148',
    borough: 'QUEENS',
    trade: 'FRAMING',
    projectAddress: '31-28 30th Ave, Astoria',
    contractorPool: testPool,
  });

  assert.equal(lead2.assignedContractor.id, 'pilot_2'); // Mendoza
  assert.equal(testPool[1].assignedLeadsCount, 1);

  // Trade normalization
  assert.equal(normalizeTrade('sheetrock framing'), 'DRYWALL');
  assert.equal(normalizeTrade('kitchen remodel and tile'), 'TILE');
  assert.equal(normalizeTrade('steel structural beam'), 'STRUCTURAL');
});

test('MODULE 3: Victory Ping creates Stripe/QBO invoice payload and formatted celebration WhatsApp message', () => {
  const ping = buildVictoryPingPayload({
    contractorId: 'pilot_1',
    contractorName: 'Don Hector',
    contractorCompanyName: 'Alianza Framing NYC',
    contractorPhone: '17185550199',
    customerName: 'Carlos Mendoza',
    projectAddress: '31-28 30th Ave, Astoria, Queens',
    totalContractAmount: 85000,
    clearedDepositAmount: 25500,
    isPilotDiscountActive: true, // 50% discount
    currentYearBilled: 0,
    stripeInvoiceCheckoutUrl: 'https://buy.stripe.com/test_123',
  });

  // Math verification: Standard fee on $85k is $6,150. With 50% pilot discount, it is $3,075.
  assert.equal(ping.invoicePayload.commissionMath.isPilotDiscount, true);
  assert.equal(ping.invoicePayload.commissionMath.standardFee, 6150);
  assert.equal(ping.invoicePayload.commissionMath.appliedFee, 3075);
  assert.equal(ping.invoicePayload.commissionMath.effectiveRate, 0.0362); // 3.62%

  // WhatsApp Alert verification
  assert.match(ping.victoryMessage, /FELICITACIONES DON HECTOR/);
  assert.match(ping.victoryMessage, /\$25,500/);
  assert.match(ping.victoryMessage, /\$3,075/);
  assert.match(ping.victoryMessage, /https:\/\/buy\.stripe\.com\/test_123/);
  assert.equal(ping.whatsappPayload.to, '17185550199');
});
