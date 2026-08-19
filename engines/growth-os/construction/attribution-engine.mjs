/**
 * Attribution Engine for Construction Vertical
 * Matches QuickBooks Online invoices and payments back to leads captured via WhatsApp,
 * Tracked Phone Numbers, or DOB Permit Outbound by matching client phone/email.
 */

export function normalizePhone(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return '';
  const digits = rawPhone.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function normalizeEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string') return '';
  return rawEmail.trim().toLowerCase();
}

/**
 * Searches a collection of leads to find a match for a given customer contact.
 * Primary: 10-digit phone match
 * Fallback: Case-insensitive email match
 */
export function matchLeadInPool(leads, { phone, email }) {
  const cleanPhone = normalizePhone(phone);
  const cleanEmail = normalizeEmail(email);

  if (cleanPhone && cleanPhone.length === 10) {
    const matched = leads.find((l) => normalizePhone(l.clientPhone) === cleanPhone);
    if (matched) return { matchType: 'PHONE_EXACT', lead: matched };
  }

  if (cleanEmail && cleanEmail.includes('@')) {
    const matched = leads.find((l) => normalizeEmail(l.clientEmail) === cleanEmail);
    if (matched) return { matchType: 'EMAIL_EXACT', lead: matched };
  }

  return { matchType: 'NONE', lead: null };
}
