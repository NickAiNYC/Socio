/**
 * Module 3: The "Victory Ping" & Automatic Commission Invoicing Engine
 * Triggers when QuickBooks Online confirms a cleared customer deposit in the contractor's bank account.
 * Automatically generates a Stripe/QBO commission invoice and sends a celebratory WhatsApp notification.
 */

import { computeTieredCommission, evaluateCommissionWithCap } from './commission-engine.mjs';

export function buildVictoryPingPayload({
  contractorId,
  contractorName = 'Don Hector',
  contractorCompanyName = 'Alianza Framing NYC',
  contractorPhone = '17185550199',
  customerName = 'Carlos Mendoza',
  projectAddress = '31-28 30th Ave, Astoria, Queens',
  totalContractAmount = 85000,
  clearedDepositAmount = 25500,
  isPilotDiscountActive = true, // 50% discount for founding 5
  currentYearBilled = 0,
  stripeInvoiceCheckoutUrl = 'https://buy.stripe.com/socio_comm_demo_link',
}) {
  // 1. Calculate commission
  const standardCalc = computeTieredCommission(totalContractAmount);
  
  // Apply 50% pilot discount if active
  const discountMultiplier = isPilotDiscountActive ? 0.50 : 1.0;
  const rawFee = Number((standardCalc.fee * discountMultiplier).toFixed(2));
  const effectiveRate = Number((rawFee / totalContractAmount).toFixed(4));

  const cappedCalc = evaluateCommissionWithCap({
    contractAmount: totalContractAmount,
    currentYearBilled,
    annualCap: 40000,
    isAlreadyCapped: currentYearBilled >= 40000,
  });

  const appliedFee = Math.min(rawFee, Math.max(0, 40000 - currentYearBilled));

  // 2. Build Webhook Payload for Stripe / QuickBooks Invoice Creation
  const invoicePayload = {
    eventType: 'socio.commission.invoice_generated',
    invoiceId: `INV_SOCIO_${Date.now()}`,
    contractor: {
      id: contractorId,
      companyName: contractorCompanyName,
      ownerName: contractorName,
      phone: contractorPhone,
    },
    projectDetails: {
      customerName,
      projectAddress,
      totalContractAmount,
      clearedDepositAmount,
      clearedAt: new Date().toISOString(),
    },
    commissionMath: {
      isPilotDiscount: isPilotDiscountActive,
      discountPercent: isPilotDiscountActive ? 50 : 0,
      standardFee: standardCalc.fee,
      appliedFee,
      effectiveRate,
      breakdown: standardCalc.breakdown.map((b) => ({
        tier: b.tier,
        standardRate: `${(b.rate * 100).toFixed(0)}%`,
        pilotDiscountRate: isPilotDiscountActive ? `${(b.rate * 50).toFixed(0)}%` : `${(b.rate * 100).toFixed(0)}%`,
        taxableAmount: b.taxableAmount,
        tierFee: isPilotDiscountActive ? Number((b.fee * 0.5).toFixed(2)) : b.fee,
      })),
      annualCapStatus: {
        capLimit: 40000,
        currentYearTotal: currentYearBilled + appliedFee,
        isCapped: currentYearBilled + appliedFee >= 40000,
      },
    },
    paymentLink: stripeInvoiceCheckoutUrl,
  };

  // 3. WhatsApp "Victory Ping" Message Template
  const victoryMessage = 
    `🎉 *¡FELICITACIONES ${contractorName.toUpperCase()}! DEPÓSITO COBRADO EN BANCO* 🎉\n\n` +
    `✅ *Cliente:* ${customerName}\n` +
    `📍 *Proyecto:* ${projectAddress}\n` +
    `💵 *Valor Total Contrato:* $${totalContractAmount.toLocaleString()}\n` +
    `🏦 *Anticipo Acreditado en su Banco:* $${clearedDepositAmount.toLocaleString()} (30%)\n\n` +
    `📊 *Desglose de Comisión Socio (Piloto 50% Desc):*\n` +
    `• Primeros $10k al 6%: $600.00\n` +
    `• Siguientes $40k ($10k-$50k) al 4%: $1,600.00\n` +
    `• Excedente ($35k) al 2.5%: $875.00\n` +
    `👉 *Total Comisión Aplicada:* *$${appliedFee.toLocaleString()}* (Tasa Efectiva: ${(effectiveRate * 100).toFixed(2)}%)\n\n` +
    `💳 Para liquidar la factura de servicio en 1 clic y mantener activas las cuadrillas:\n` +
    `${stripeInvoiceCheckoutUrl}\n\n` +
    `¡A seguir facturando fuerte en NYC! 🔨🚀`;

  return {
    invoicePayload,
    victoryMessage,
    whatsappPayload: {
      messaging_product: 'whatsapp',
      to: contractorPhone.replace(/\D/g, ''),
      type: 'text',
      text: { body: victoryMessage },
    },
  };
}
