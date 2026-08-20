/**
 * 48-Hour Leak Scan ("Escaneo de Fugas") Generator for NYC Contractors
 * Scrapes/simulates digital presence gaps and computes estimated monthly/annual revenue leakage.
 */

export function auditGoogleBusinessProfile({ claimed = false, reviewCount = 8, avgRating = 4.2, lastPhotoDaysAgo = 180 }) {
  const leaks = [];
  let score = 100;

  if (avgRating < 4.0) {
    leaks.push({
      item: `Calificación promedio baja: ${avgRating.toFixed(1)} estrellas (Mínimo recomendado: 4.0+)`,
      impact: 'Calificaciones por debajo de 4.0 reducen la tasa de conversión y la visibilidad en Google Maps',
      lostBidsEstMonthly: 1.2,
    });
    score -= 15;
  }

  if (!claimed) {
    leaks.push({
      item: 'Perfil de Google no reclamado / verificado',
      impact: 'Riesgo de suplantación y menor ranking en Google Maps (3-Pack local)',
      lostBidsEstMonthly: 1.5,
    });
    score -= 30;
  }

  if (reviewCount < 25) {
    leaks.push({
      item: `Solo ${reviewCount} reseñas en Google (Mínimo recomendado: 35+)`,
      impact: '76% de propietarios en NYC eligen contratistas con más de 30 reseñas verificadas',
      lostBidsEstMonthly: 2.0,
    });
    score -= 25;
  }

  if (lastPhotoDaysAgo > 60) {
    leaks.push({
      item: 'Fotos de proyectos desactualizadas (>60 días sin subir obra terminada)',
      impact: 'Falta de prueba visual de terminados reduce la conversión de llamadas en 40%',
      lostBidsEstMonthly: 1.0,
    });
    score -= 15;
  }

  return { score: Math.max(0, score), leaks };
}

export function auditWebsitePresence({ hasWebsite = false, isMobileOptimized = false, hasEstimateCta = false }) {
  const leaks = [];
  let score = 100;

  if (!hasWebsite) {
    leaks.push({
      item: 'Sin sitio web activo propio',
      impact: 'Propietarios de alto presupuesto ($50k+) descartan contratistas sin portafolio web',
      lostBidsEstMonthly: 2.5,
    });
    return { score: 10, leaks };
  }

  if (!isMobileOptimized) {
    leaks.push({
      item: 'Sitio no adaptado para teléfonos celulares',
      impact: '88% de búsquedas de remodelación se hacen desde smartphones en NYC',
      lostBidsEstMonthly: 1.5,
    });
    score -= 35;
  }

  if (!hasEstimateCta) {
    leaks.push({
      item: 'Sin botón directo de "Pedir Cotización / WhatsApp" visible',
      impact: 'Visitantes abandonan sin dejar datos de contacto del proyecto',
      lostBidsEstMonthly: 2.0,
    });
    score -= 30;
  }

  return { score: Math.max(0, score), leaks };
}

export function auditMissedCallSpeed({ simulatedResponseMinutes = 180, hasAfterHoursVoicemailText = false }) {
  const leaks = [];
  let score = 100;

  if (simulatedResponseMinutes > 15) {
    leaks.push({
      item: `Tiempo de respuesta a llamadas perdidas: ~${Math.round(simulatedResponseMinutes / 60)} horas`,
      impact: 'El 78% de clientes contrata al primer profesional que responde en menos de 5 minutos',
      lostBidsEstMonthly: 3.0,
    });
    score -= 40;
  }

  if (!hasAfterHoursVoicemailText) {
    leaks.push({
      item: 'Sin SMS / WhatsApp de auto-respuesta fuera de horario (después de las 5:00 PM)',
      impact: 'Llamadas de propietarios nocturnos se pierden permanentemente',
      lostBidsEstMonthly: 2.0,
    });
    score -= 25;
  }

  return { score: Math.max(0, score), leaks };
}

/**
 * Generates the full Escaneo de Fugas Scorecard with Dollar Impact Calculation.
 * Average NYC Renovation Ticket = $35,000 (Conservative baseline).
 */
export function generateContractorLeakScan({
  businessName,
  ownerName = 'Propietario',
  phone,
  borough = 'Queens',
  avgTicket = 35000,
  gbpData = {},
  webData = {},
  callData = {},
}) {
  const gbpAudit = auditGoogleBusinessProfile(gbpData);
  const webAudit = auditWebsitePresence(webData);
  const callAudit = auditMissedCallSpeed(callData);

  const allLeaks = [...gbpAudit.leaks, ...webAudit.leaks, ...callAudit.leaks];
  const totalBidsLostMonthly = allLeaks.reduce((acc, l) => acc + l.lostBidsEstMonthly, 0);

  // Close rate assumption on lost bids = 20%
  const estimatedLostContractsPerYear = Math.round((totalBidsLostMonthly * 0.20) * 12);
  const estimatedAnnualRevenueLeakage = estimatedLostContractsPerYear * avgTicket;
  const overallHealthScore = Math.round((gbpAudit.score * 0.35) + (webAudit.score * 0.30) + (callAudit.score * 0.35));

  return {
    reportId: `LEAK_SCAN_${Date.now()}`,
    generatedAt: new Date().toISOString(),
    contractor: {
      businessName,
      ownerName,
      phone,
      borough,
    },
    scores: {
      overallHealthScore,
      googleBusinessProfileScore: gbpAudit.score,
      websitePresenceScore: webAudit.score,
      leadResponseSpeedScore: callAudit.score,
    },
    financialImpact: {
      avgProjectTicket: avgTicket,
      estimatedLostBidsMonthly: Number(totalBidsLostMonthly.toFixed(1)),
      estimatedLostContractsPerYear,
      estimatedAnnualRevenueLeakage,
      currency: 'USD',
    },
    detectedLeaks: allLeaks,
    recommendedImmediateFixes: [
      '1. Implementar Sistema de Respuesta Instantánea por WhatsApp en <90 segundos.',
      '2. Reclamar y optimizar ficha de Google Maps con 25+ reseñas con fotos de obras.',
      '3. Conectar radar de permisos DOB de NYC para captar proyectos antes que la competencia.',
    ],
  };
}
