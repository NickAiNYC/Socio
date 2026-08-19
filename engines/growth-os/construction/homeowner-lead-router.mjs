/**
 * Module 2: DOB Homeowner Routing Engine (Live Lead Matchmaker)
 * Matches warm inbound property owners to the 5 Pilot Contractors based on:
 * 1. Geographic Borough coverage (Queens, Brooklyn, Bronx, Manhattan)
 * 2. Trade Specialty (General Contractor, Framing, Gut Rehab, Tile/Kitchen, Structural)
 * 3. Fair-Share Round-Robin distribution across qualified contractors
 */

export const DEFAULT_PILOT_ROSTER = [
  {
    id: 'pilot_1',
    companyName: 'Alianza Framing NYC',
    ownerName: 'Don Hector',
    phone: '17185550199',
    boroughs: ['QUEENS', 'BROOKLYN'],
    trades: ['GENERAL_CONTRACTOR', 'FRAMING', 'GUT_REHAB', 'DRYWALL'],
    maxLeadsPerMonth: 15,
    assignedLeadsCount: 0,
    lastAssignedAt: null,
  },
  {
    id: 'pilot_2',
    companyName: 'Mendoza Drywall Corp',
    ownerName: 'Carlos Mendoza',
    phone: '17185550192',
    boroughs: ['QUEENS', 'BROOKLYN', 'BRONX'],
    trades: ['DRYWALL', 'FRAMING', 'PLASTER', 'PAINTING'],
    maxLeadsPerMonth: 15,
    assignedLeadsCount: 0,
    lastAssignedAt: null,
  },
  {
    id: 'pilot_3',
    companyName: 'Queens Gut Rehab Masters',
    ownerName: 'Santiago Vargas',
    phone: '17185550194',
    boroughs: ['QUEENS', 'MANHATTAN', 'BROOKLYN'],
    trades: ['GENERAL_CONTRACTOR', 'GUT_REHAB', 'STRUCTURAL', 'BROWNSTONE'],
    maxLeadsPerMonth: 15,
    assignedLeadsCount: 0,
    lastAssignedAt: null,
  },
  {
    id: 'pilot_4',
    companyName: 'Corona Tile & Kitchen',
    ownerName: 'Mateo Delgado',
    phone: '19175550148',
    boroughs: ['QUEENS', 'BROOKLYN'],
    trades: ['TILE', 'KITCHEN_BATH', 'FINISH_CARPENTRY', 'PLUMBING_ROUGH'],
    maxLeadsPerMonth: 15,
    assignedLeadsCount: 0,
    lastAssignedAt: null,
  },
  {
    id: 'pilot_5',
    companyName: 'Bronx Structural Beams',
    ownerName: 'Jorge Benitez',
    phone: '19295550177',
    boroughs: ['BRONX', 'MANHATTAN', 'QUEENS'],
    trades: ['GENERAL_CONTRACTOR', 'STRUCTURAL', 'STEEL_BEAMS', 'STOREFRONT'],
    maxLeadsPerMonth: 15,
    assignedLeadsCount: 0,
    lastAssignedAt: null,
  },
];

export function normalizeTrade(rawTrade) {
  if (!rawTrade || typeof rawTrade !== 'string') return 'GENERAL_CONTRACTOR';
  const t = rawTrade.toUpperCase();
  if (t.includes('DRYWALL') || t.includes('SHEETROCK')) return 'DRYWALL';
  if (t.includes('TILE') || t.includes('BATH') || t.includes('COCINA') || t.includes('KITCHEN')) return 'TILE';
  if (t.includes('BEAM') || t.includes('STEEL') || t.includes('STRUCT')) return 'STRUCTURAL';
  if (t.includes('GUT') || t.includes('REHAB') || t.includes('OVERHAUL')) return 'GUT_REHAB';
  if (t.includes('FRAME') || t.includes('FRAMING') || t.includes('CARPENTER')) return 'FRAMING';
  return 'GENERAL_CONTRACTOR';
}

export function matchHomeownerLead({
  homeownerName,
  homeownerPhone,
  borough = 'QUEENS',
  trade = 'GENERAL_CONTRACTOR',
  projectAddress = 'NYC Address',
  scopeDescription = 'Renovation project',
  estimatedBudget = 45000,
  contractorPool = DEFAULT_PILOT_ROSTER,
}) {
  const cleanBorough = borough.toUpperCase().replace(/\s+/g, '_');
  const targetTrade = normalizeTrade(trade);

  // 1. Filter candidates by Borough and Trade
  let candidates = contractorPool.filter((c) => {
    const coversBorough = c.boroughs.includes(cleanBorough);
    const coversTrade = c.trades.includes(targetTrade) || c.trades.includes('GENERAL_CONTRACTOR');
    const withinCapacity = (c.assignedLeadsCount || 0) < (c.maxLeadsPerMonth || 15);
    return coversBorough && coversTrade && withinCapacity;
  });

  // Fallback: If no strict trade match, fallback to borough-matching GC
  if (candidates.length === 0) {
    candidates = contractorPool.filter((c) => c.boroughs.includes(cleanBorough));
  }

  // Fallback 2: If borough not found, choose least loaded contractor
  if (candidates.length === 0) {
    candidates = [...contractorPool];
  }

  // 2. Round-Robin Sorting: Prioritize lowest assignedLeadsCount, then oldest lastAssignedAt
  candidates.sort((a, b) => {
    if (a.assignedLeadsCount !== b.assignedLeadsCount) {
      return (a.assignedLeadsCount || 0) - (b.assignedLeadsCount || 0);
    }
    const timeA = a.lastAssignedAt ? new Date(a.lastAssignedAt).getTime() : 0;
    const timeB = b.lastAssignedAt ? new Date(b.lastAssignedAt).getTime() : 0;
    return timeA - timeB;
  });

  const selectedContractor = candidates[0];

  // Update contractor load stats
  selectedContractor.assignedLeadsCount = (selectedContractor.assignedLeadsCount || 0) + 1;
  selectedContractor.lastAssignedAt = new Date().toISOString();

  // Create dispatch payload for Contractor
  const contractorWhatsAppAlert = `🚨 *NUEVO PROPIETARIO ASIGNADO (DOB PERMIT)* 🚨\n\n` +
    `👤 Propietario: *${homeownerName}*\n` +
    `📞 Teléfono: *${homeownerPhone}*\n` +
    `📍 Ubicación: *${projectAddress} (${borough})*\n` +
    `🔨 Trabajo: *${scopeDescription}*\n` +
    `💰 Presupuesto Estimado: *$${estimatedBudget.toLocaleString()}*\n\n` +
    `⚡ *Acción Inmediata:* Llame o envíe un WhatsApp en menos de 5 minutos antes de que consulte a otro contratista.`;

  return {
    routingId: `ROUTE_${Date.now()}`,
    assignedContractor: {
      id: selectedContractor.id,
      companyName: selectedContractor.companyName,
      ownerName: selectedContractor.ownerName,
      phone: selectedContractor.phone,
    },
    leadDetails: {
      homeownerName,
      homeownerPhone,
      borough: cleanBorough,
      trade: targetTrade,
      projectAddress,
      scopeDescription,
      estimatedBudget,
    },
    contractorWhatsAppAlert,
    routedAt: new Date().toISOString(),
  };
}
