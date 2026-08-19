/**
 * WhatsApp Outbound Pitch Agent for NYC Hispanic Contractors
 * Enforces Governor Rules:
 * 1. Maximum 3 touches per prospect.
 * 2. 7:00 PM EST quiet-hours cutoff (messages after 19:00 EST are queued for 09:00 EST next business day).
 * 3. Language mirroring (ES/EN) based on inbound responses.
 * 4. Human Approval Gate on Touch 1 before initial dispatch.
 */

export const GOVERNOR_LIMITS = {
  MAX_TOUCHES: 3,
  QUIET_HOURS_EST_END: 19, // 7:00 PM EST
  QUIET_HOURS_EST_START: 8, // 8:00 AM EST
  HUMAN_APPROVAL_REQUIRED_TOUCH: 1,
};

export function isWithinEstOperatingHours(date = new Date()) {
  const estString = date.toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false, hour: 'numeric' });
  const estHour = parseInt(estString, 10);
  return estHour >= GOVERNOR_LIMITS.QUIET_HOURS_EST_START && estHour < GOVERNOR_LIMITS.QUIET_HOURS_EST_END;
}

export function buildPitchPayload({
  prospectPhone,
  ownerName = 'Maestro',
  companyName = 'su empresa de construcción',
  borough = 'Queens',
  touchNumber = 1,
  lang = 'es',
  pdfGuideUrl = 'https://socio-one.vercel.app/docs/guia-marketing-contratistas-nyc.pdf',
  voiceAudioUrl = 'https://socio-one.vercel.app/assets/audio/socio-voice-intro.mp3',
}) {
  const cleanPhone = prospectPhone.replace(/\D/g, '');

  if (touchNumber > GOVERNOR_LIMITS.MAX_TOUCHES) {
    throw new Error(`Governor blocked: Touch ${touchNumber} exceeds maximum allowed touches (${GOVERNOR_LIMITS.MAX_TOUCHES}).`);
  }

  // Touch 1: Escaneo de Fugas (Offer 48h Leak Scan with 0 upfront fees)
  if (touchNumber === 1) {
    const text = lang === 'es'
      ? `Hola ${ownerName}, le saluda Nick de Socio en NYC. Vimos los proyectos que ${companyName} hace en ${borough}. Preparamos un *Escaneo de Fugas* de 1 página que muestra llamadas y contratos que están yendo a competidores locales en su zona. Es 100% gratuito y no cobramos nada por adelantado. ¿Le gustaría que se lo comparta por aquí en PDF?`
      : `Hi ${ownerName}, this is Nick from Socio in NYC. We saw the work ${companyName} does in ${borough}. We prepared a 1-page *Leak Scan* showing calls and remodeling bids currently leaking to competitors in your area. 100% free with zero upfront fees. Would you like me to send over the PDF here?`;

    return {
      touchNumber: 1,
      type: 'text',
      requiresApproval: true,
      payload: {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: text },
      },
    };
  }

  // Touch 2: Social Proof & QuickBooks Deposit Rule
  if (touchNumber === 2) {
    const text = lang === 'es'
      ? `${ownerName}, quería agregar: con Socio usted *nunca paga por adelantado ni por estimados no cerrados*. Nuestro sistema solo cobra una pequeña comisión cuando su cliente deposita el anticipo en su cuenta bancaria. Si el cliente no paga el depósito, nuestro costo es $0.00.`
      : `${ownerName}, wanted to follow up: with Socio you *never pay upfront or for lost estimates*. Our engine only earns a small commission when your client deposits the initial payment into your bank account. If the customer does not pay, you pay $0.00.`;

    return {
      touchNumber: 2,
      type: 'text',
      requiresApproval: false,
      payload: {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: text },
      },
    };
  }

  // Touch 3: Voice Note + PDF Lead Magnet
  if (touchNumber === 3) {
    const caption = lang === 'es'
      ? `Don ${ownerName}, le dejé una nota de voz rápida de 20 segundos arriba. También le adjunto la *Guía de Adquisición de Contratos para Contratistas Hispanos en NYC*. Si en el futuro busca expandir sus cuadrillas, aquí estamos a su orden.`
      : `Mr. ${ownerName}, left you a quick 20-second audio note above. Also attaching our *NYC Contractor Contract Acquisition Guide*. Whenever you are looking to scale your crews, we are here to help.`;

    return {
      touchNumber: 3,
      type: 'voice_and_document',
      requiresApproval: false,
      voicePayload: {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'audio',
        audio: { link: voiceAudioUrl },
      },
      documentPayload: {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'document',
        document: {
          link: pdfGuideUrl,
          filename: 'Guia_Contratistas_NYC_Socio.pdf',
          caption,
        },
      },
    };
  }
}
