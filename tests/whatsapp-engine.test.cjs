const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalizePhoneNumber,
  isQuietHours,
  isOptedOut,
  checkFrequencyCap,
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_WABA_ID,
  WHATSAPP_VERIFY_TOKEN,
} = require('../lib/whatsapp-engine.cjs');

test('WhatsApp Engine: normalizePhoneNumber formats phone to E.164 without plus', () => {
  assert.equal(normalizePhoneNumber('+1 (917) 555-1234'), '19175551234');
  assert.equal(normalizePhoneNumber('917-555-1234'), '19175551234');
  assert.equal(normalizePhoneNumber('19175551234'), '19175551234');
  assert.equal(normalizePhoneNumber('+52 55 1234 5678'), '525512345678');
});

test('WhatsApp Engine: isOptedOut checks suppression list', () => {
  const suppression = [
    { phone: '19175550000', reason: 'USER_KEYWORD_OPT_OUT' },
    '19175559999'
  ];
  assert.equal(isOptedOut('+1 (917) 555-0000', suppression), true);
  assert.equal(isOptedOut('19175559999', suppression), true);
  assert.equal(isOptedOut('+1 (917) 555-1111', suppression), false);
});

test('WhatsApp Engine: checkFrequencyCap enforces max 3 messages per 7 days', () => {
  const now = Date.now();
  const phone = '19175551234';
  const history = [
    { to: phone, timestamp: new Date(now - (1 * 24 * 3600 * 1000)).toISOString() },
    { to: phone, timestamp: new Date(now - (3 * 24 * 3600 * 1000)).toISOString() },
  ];

  // 2 messages sent -> allowed
  const check1 = checkFrequencyCap(phone, history, 3);
  assert.equal(check1.allowed, true);
  assert.equal(check1.recentCount, 2);

  // 3rd message added -> limit reached
  history.push({ to: phone, timestamp: new Date(now - (4 * 24 * 3600 * 1000)).toISOString() });
  const check2 = checkFrequencyCap(phone, history, 3);
  assert.equal(check2.allowed, false);
  assert.equal(check2.recentCount, 3);

  // An old message (> 7 days) should not count against the limit
  const oldHistory = [
    { to: phone, timestamp: new Date(now - (8 * 24 * 3600 * 1000)).toISOString() },
    { to: phone, timestamp: new Date(now - (9 * 24 * 3600 * 1000)).toISOString() },
    { to: phone, timestamp: new Date(now - (10 * 24 * 3600 * 1000)).toISOString() },
  ];
  const check3 = checkFrequencyCap(phone, oldHistory, 3);
  assert.equal(check3.allowed, true);
  assert.equal(check3.recentCount, 0);
});

test('WhatsApp Engine: configuration constants are defined', () => {
  assert.ok(WHATSAPP_TOKEN.startsWith('EAA4uMf8'));
  assert.equal(WHATSAPP_PHONE_NUMBER_ID, '1180138218526038');
  assert.equal(WHATSAPP_WABA_ID, '1915462325789357');
  assert.equal(WHATSAPP_VERIFY_TOKEN, 'socio_wa_verify_2026');
});
