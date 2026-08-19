/**
 * WhatsApp Business API Service for NYC Construction Outbound & Support
 * Handles 3-touch estimate sequence + Google Business Profile review triggers.
 */

export function buildWhatsAppMessage({
  touchNumber = 1,
  contractorName = 'Constructora Socio NYC',
  clientName = 'Estimado Cliente',
  projectScope = 'su proyecto de construcción',
  gbpReviewLink = null,
}) {
  if (gbpReviewLink) {
    return `Estimado(a) ${clientName}, gracias por confiar en ${contractorName} para ${projectScope}. Su factura final ha sido saldada con éxito. ¿Nos apoyaría con una breve reseña de 5 estrellas en Google? Le toma menos de un minuto aquí: ${gbpReviewLink}`;
  }

  switch (touchNumber) {
    case 1:
      return `Hola ${clientName}, le saluda el equipo de ${contractorName}. Recibimos los detalles de ${projectScope}. ¿Cuándo tiene disponibilidad hoy para que nuestro maestro de obra pase a tomar medidas exactas en persona?`;
    case 2:
      return `Hola ${clientName}, ${contractorName} aquí. Le compartimos el presupuesto para ${projectScope}. ¿Pudo revisarlo o tiene alguna duda sobre los materiales o las fases de entrega?`;
    case 3:
      return `${clientName}, para agendar el inicio de obra de ${projectScope} este mes y reservar la cuadrilla, solo requerimos confirmar el depósito inicial del contrato. Quedamos atentos para comenzar.`;
    default:
      return `Hola ${clientName}, ${contractorName} a su servicio para ${projectScope}.`;
  }
}

export async function dispatchWhatsAppMessage({
  toPhone,
  messageText,
  phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID,
  accessToken = process.env.WHATSAPP_ACCESS_TOKEN,
  fetchFn = globalThis.fetch,
}) {
  const cleanPhone = toPhone.replace(/\D/g, '');

  if (!phoneNumberId || !accessToken) {
    return {
      status: 'simulated',
      to: cleanPhone,
      message: messageText,
      timestamp: new Date().toISOString(),
    };
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
  const res = await fetchFn(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: cleanPhone,
      type: 'text',
      text: { body: messageText },
    }),
  });

  const data = await res.json();
  return { status: 'sent', data };
}
