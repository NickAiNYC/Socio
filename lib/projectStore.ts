'use client';

export type LifecycleState =
  | 'CREATED'
  | 'DEFINED'
  | 'MATCHED'
  | 'IN_PROGRESS'
  | 'RECORDED'
  | 'COMPLETED';

export type ScopeItem = {
  id: string;
  category: string;
  spec: string;
  type: 'INCLUDED' | 'EXCLUDED' | 'UNKNOWN';
};

export type ComplianceItem = {
  id: string;
  label: string;
  detail: string;
  status: 'CLEARED' | 'VERIFIED' | 'PENDING' | 'SIGNED';
};

export type ContractorCandidate = {
  id: string;
  name: string;
  license: string;
  specialty: string;
  fitScore: number;
  completedJobs: number;
  borough: string;
  bidAmount: number;
  bidStatus: 'SUBMITTED' | 'AWARDED' | 'DECLINED' | 'PENDING';
};

export type MilestoneRail = {
  id: string;
  title: string;
  amount: number;
  allocationPercent: number;
  status: 'PENDING' | 'FUNDED_ON_RAIL' | 'INSPECTION_PENDING' | 'VERIFIED' | 'DISBURSED';
  targetDate: string;
  verificationProof: string;
};

export type SocioProject = {
  id: string;
  lifecycleState: LifecycleState;
  createdAt: string;
  property: {
    address: string;
    neighborhood: string;
    borough: string;
    type: string;
    squareFeet: number;
    taxLot: string;
  };
  scope: {
    trade: string;
    csiCode: string;
    description: string;
    items: ScopeItem[];
  };
  budget: {
    target: number;
    normalizedMin: number;
    normalizedMax: number;
    awardedGmv: number;
    disbursed: number;
    activeRailAmount: number;
  };
  compliance: ComplianceItem[];
  contractors: ContractorCandidate[];
  awardedContractorId?: string;
  milestones: MilestoneRail[];
  telemetry: {
    costVariance: string;
    scheduleVariance: string;
    changeOrders: number;
    benchmarkContributionStatus: 'PENDING' | 'RECORDED';
  };
};

export const CANONICAL_PROJECT: SocioProject = {
  id: 'PRJ-7102-BK',
  lifecycleState: 'IN_PROGRESS',
  createdAt: '2026-08-14',
  property: {
    address: '172 Union Street',
    neighborhood: 'Carroll Gardens',
    borough: 'Brooklyn',
    type: 'Pre-War Brownstone Co-op',
    squareFeet: 1450,
    taxLot: 'Block 354 · Lot 19',
  },
  scope: {
    trade: 'Plaster & Gypsum Board Assemblies',
    csiCode: 'CSI 09 20 00',
    description: 'Level 5 skim coat restoration, custom white oak architectural millwork, and selective partition framing.',
    items: [
      { id: 'SC-01', category: 'Surface Demolition', spec: 'Plaster extraction down to sound lath; dust containment protocol.', type: 'INCLUDED' },
      { id: 'SC-02', category: 'Plaster Restoration', spec: '3-coat skim finish to Level 5 architectural standard throughout.', type: 'INCLUDED' },
      { id: 'SC-03', category: 'Millwork', spec: 'Custom quarter-sawn white oak cabinetry & concealed Blum hardware.', type: 'INCLUDED' },
      { id: 'SC-04', category: 'MEP Rough-in', spec: 'Subfloor joist leveling & heavy wiring (contracted under DOB Alt II).', type: 'EXCLUDED' },
      { id: 'SC-05', category: 'Appliance Hookup', spec: 'Commercial Wolf/Sub-Zero commissioning by certified factory agent.', type: 'EXCLUDED' },
      { id: 'SC-06', category: 'Concealed Stack', spec: 'Cornice interior water staining integrity (cleared post-inspection).', type: 'UNKNOWN' },
    ],
  },
  budget: {
    target: 85000,
    normalizedMin: 85000,
    normalizedMax: 105000,
    awardedGmv: 84500,
    disbursed: 21125,
    activeRailAmount: 29575,
  },
  compliance: [
    { id: 'CP-01', label: 'COI (ACORD 25)', detail: '$1M/$2M commercial liability with managing agent named as additional insured', status: 'VERIFIED' },
    { id: 'CP-02', label: 'ALTERATION AGREEMENT', detail: 'Executed pre-war co-op standard rider with security deposit on file', status: 'CLEARED' },
    { id: 'CP-03', label: 'LEAD-SAFE RRP', detail: 'EPA certified containment and HEPA air scrubbing documentation', status: 'VERIFIED' },
    { id: 'CP-04', label: 'WORK-HOUR RIDER', detail: 'Strict 9:00 AM – 4:30 PM weekday compliance with elevator reservation', status: 'SIGNED' },
  ],
  contractors: [
    {
      id: 'CREW-41',
      name: 'Master Crew #41 (Apex Craft)',
      license: 'NYC DOB Lic #619842',
      specialty: 'Historic Plaster & High-End Millwork',
      fitScore: 94,
      completedJobs: 14,
      borough: 'Brooklyn',
      bidAmount: 84500,
      bidStatus: 'AWARDED',
    },
    {
      id: 'CREW-18',
      name: 'Vanguard Restoration GC',
      license: 'NYC DOB Lic #588214',
      specialty: 'Brownstone Envelope & Interior Finishes',
      fitScore: 88,
      completedJobs: 9,
      borough: 'Brooklyn',
      bidAmount: 88200,
      bidStatus: 'DECLINED',
    },
    {
      id: 'CREW-29',
      name: 'Cobble Hill Guild',
      license: 'NYC DOB Lic #701449',
      specialty: 'Architectural Carpentry & Finishes',
      fitScore: 82,
      completedJobs: 6,
      borough: 'Brooklyn',
      bidAmount: 81500,
      bidStatus: 'DECLINED',
    },
  ],
  awardedContractorId: 'CREW-41',
  milestones: [
    {
      id: 'MS-01',
      title: 'Substrate Demolition & Surface Prep',
      amount: 21125,
      allocationPercent: 25,
      status: 'DISBURSED',
      targetDate: '2026-08-24',
      verificationProof: 'Hallway Masonite certified · Dust containment sealed · Dual owner/GC signoff',
    },
    {
      id: 'MS-02',
      title: 'Level 5 Plaster Restoration & Skim-Coat',
      amount: 29575,
      allocationPercent: 35,
      status: 'FUNDED_ON_RAIL',
      targetDate: '2026-09-08',
      verificationProof: 'Capital secured on milestone rail · Awaiting on-site punch inspection clearance',
    },
    {
      id: 'MS-03',
      title: 'Architectural Primer & Fine Paint Coating',
      amount: 25350,
      allocationPercent: 30,
      status: 'PENDING',
      targetDate: '2026-09-20',
      verificationProof: 'Benjamin Moore Aura specs · Pre-ordered batch verification',
    },
    {
      id: 'MS-04',
      title: 'Final Detailing, Punchlist & Lien Waiver',
      amount: 8450,
      allocationPercent: 10,
      status: 'PENDING',
      targetDate: '2026-09-28',
      verificationProof: 'Managing agent signoff & statutory NYS mechanic lien waiver execution',
    },
  ],
  telemetry: {
    costVariance: '-0.6%',
    scheduleVariance: '+3.3%',
    changeOrders: 0,
    benchmarkContributionStatus: 'RECORDED',
  },
};

const STORAGE_KEY = 'socio_project_registry_v1';

function getStoredProjects(): Record<string, SocioProject> {
  if (typeof window === 'undefined') return { [CANONICAL_PROJECT.id]: CANONICAL_PROJECT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = { [CANONICAL_PROJECT.id]: CANONICAL_PROJECT };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return { [CANONICAL_PROJECT.id]: CANONICAL_PROJECT };
  }
}

function saveProjects(projects: Record<string, SocioProject>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save to project store:', err);
  }
}

export function getProject(id: string): SocioProject {
  const projects = getStoredProjects();
  return projects[id] || CANONICAL_PROJECT;
}

export type IntakeInput = {
  propertyType: string;
  neighborhood: string;
  trade: string;
  scope: string;
  schedule: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  walkthroughWindow?: string;
};

export function createProjectFromIntake(intake: IntakeInput): SocioProject {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const boroughCode = intake.neighborhood.toLowerCase().includes('manhattan')
    ? 'MN'
    : intake.neighborhood.toLowerCase().includes('queens')
    ? 'QN'
    : 'BK';
  const id = `PRJ-${randomSuffix}-${boroughCode}`;

  const budgetNum = parseInt(intake.budget.replace(/[^0-9]/g, '')) || 85000;
  const minBudget = Math.round(budgetNum * 0.9);
  const maxBudget = Math.round(budgetNum * 1.15);

  const newProject: SocioProject = {
    id,
    lifecycleState: 'DEFINED',
    createdAt: new Date().toISOString().split('T')[0],
    property: {
      address: `${intake.neighborhood} Residence`,
      neighborhood: intake.neighborhood || 'Carroll Gardens',
      borough: boroughCode === 'MN' ? 'Manhattan' : boroughCode === 'QN' ? 'Queens' : 'Brooklyn',
      type: intake.propertyType || 'NYC Co-op',
      squareFeet: 1250,
      taxLot: `Tax Lot ${Math.floor(100 + Math.random() * 900)}/${Math.floor(10 + Math.random() * 90)}`,
    },
    scope: {
      trade: intake.trade || 'Interior Renovation & Finishes',
      csiCode: intake.trade.toLowerCase().includes('plaster') || intake.trade.toLowerCase().includes('paint')
        ? 'CSI 09 20 00'
        : intake.trade.toLowerCase().includes('kitchen')
        ? 'CSI 12 35 30'
        : 'CSI 09 00 00',
      description: intake.scope || 'Structured architectural scope codified with explicit inclusions, exclusions, and milestones.',
      items: [
        {
          id: 'SC-01',
          category: 'Site Mobilization & Prep',
          spec: 'Hallway Masonite protection, HEPA containment, and elevator booking reservation.',
          type: 'INCLUDED',
        },
        {
          id: 'SC-02',
          category: 'Demolition & Surface Prep',
          spec: 'Selective extraction to sound substrate adhering to NYC quiet-hour guidelines.',
          type: 'INCLUDED',
        },
        {
          id: 'SC-03',
          category: 'Primary Trade Execution',
          spec: intake.scope ? `${intake.scope.slice(0, 80)}...` : 'Level 5 surface finish and custom architectural installations.',
          type: 'INCLUDED',
        },
        {
          id: 'SC-04',
          category: 'Secondary Structural MEP',
          spec: 'Major structural modifications and riser relocations (subject to separate DOB Alt II permit).',
          type: 'EXCLUDED',
        },
        {
          id: 'SC-05',
          category: 'Sub-surface Latent Conditions',
          spec: 'Concealed plumbing stack and structural framing conditions verified on-site post-demo.',
          type: 'UNKNOWN',
        },
      ],
    },
    budget: {
      target: budgetNum,
      normalizedMin: minBudget,
      normalizedMax: maxBudget,
      awardedGmv: budgetNum,
      disbursed: 0,
      activeRailAmount: Math.round(budgetNum * 0.3),
    },
    compliance: [
      {
        id: 'CP-01',
        label: 'COI (ACORD 25)',
        detail: `$1M/$2M commercial general liability endorsement naming building corporation`,
        status: 'VERIFIED',
      },
      {
        id: 'CP-02',
        label: 'ALTERATION AGREEMENT',
        detail: `Standardized ${intake.propertyType || 'co-op'} alteration package and security deposit agreement`,
        status: 'CLEARED',
      },
      {
        id: 'CP-03',
        label: 'LEAD-SAFE RRP COMPLIANCE',
        detail: 'EPA Lead-Safe Certified contractor protocols and containment logs',
        status: 'VERIFIED',
      },
      {
        id: 'CP-04',
        label: 'WORK-HOUR SCHEDULE',
        detail: 'Strict 9:00 AM – 4:30 PM weekday compliance rider',
        status: 'SIGNED',
      },
    ],
    contractors: [
      {
        id: 'CREW-41',
        name: 'Master Crew #41 (Apex Craft)',
        license: 'NYC DOB Lic #619842',
        specialty: intake.trade || 'Interior Finishes',
        fitScore: 94,
        completedJobs: 14,
        borough: 'Brooklyn',
        bidAmount: budgetNum,
        bidStatus: 'SUBMITTED',
      },
      {
        id: 'CREW-18',
        name: 'Vanguard Restoration GC',
        license: 'NYC DOB Lic #588214',
        specialty: 'Historic Renovation',
        fitScore: 88,
        completedJobs: 9,
        borough: 'Brooklyn',
        bidAmount: Math.round(budgetNum * 1.04),
        bidStatus: 'SUBMITTED',
      },
    ],
    milestones: [
      {
        id: 'MS-01',
        title: 'Site Protection & Substrate Demolition',
        amount: Math.round(budgetNum * 0.25),
        allocationPercent: 25,
        status: 'FUNDED_ON_RAIL',
        targetDate: 'Week 2',
        verificationProof: 'Hallway Masonite protection confirmed · Dust barrier intact · Debris removal logged',
      },
      {
        id: 'MS-02',
        title: 'Core Rough-in & Structural Assembly',
        amount: Math.round(budgetNum * 0.35),
        allocationPercent: 35,
        status: 'PENDING',
        targetDate: 'Week 4',
        verificationProof: 'Substrate level checked · Photographic punch verification before closing walls',
      },
      {
        id: 'MS-03',
        title: 'Architectural Finishes & Millwork Fit',
        amount: Math.round(budgetNum * 0.3),
        allocationPercent: 30,
        status: 'PENDING',
        targetDate: 'Week 6',
        verificationProof: 'Level 5 finish inspection passed · Trim and cabinetry plumb and level',
      },
      {
        id: 'MS-04',
        title: 'Final Punchlist, Lien Waivers & Signoff',
        amount: Math.round(budgetNum * 0.1),
        allocationPercent: 10,
        status: 'PENDING',
        targetDate: 'Week 7',
        verificationProof: 'Statutory NY mechanic lien waiver signed · Managing agent closeout inspection cleared',
      },
    ],
    telemetry: {
      costVariance: '0.0%',
      scheduleVariance: '0.0%',
      changeOrders: 0,
      benchmarkContributionStatus: 'PENDING',
    },
  };

  const projects = getStoredProjects();
  projects[id] = newProject;
  saveProjects(projects);
  return newProject;
}

export function awardContractor(projectId: string, contractorId: string): SocioProject {
  const projects = getStoredProjects();
  const project = projects[projectId] || CANONICAL_PROJECT;

  project.awardedContractorId = contractorId;
  project.lifecycleState = 'IN_PROGRESS';
  project.contractors = project.contractors.map((c) => ({
    ...c,
    bidStatus: c.id === contractorId ? 'AWARDED' : 'DECLINED',
  }));

  const awarded = project.contractors.find((c) => c.id === contractorId);
  if (awarded) {
    project.budget.awardedGmv = awarded.bidAmount;
  }

  projects[projectId] = project;
  saveProjects(projects);
  return { ...project };
}

export function verifyMilestone(projectId: string, milestoneId: string): SocioProject {
  const projects = getStoredProjects();
  const project = projects[projectId] || CANONICAL_PROJECT;

  project.milestones = project.milestones.map((m) =>
    m.id === milestoneId ? { ...m, status: 'VERIFIED' } : m
  );

  projects[projectId] = project;
  saveProjects(projects);
  return { ...project };
}

export function disburseMilestone(projectId: string, milestoneId: string): SocioProject {
  const projects = getStoredProjects();
  const project = projects[projectId] || CANONICAL_PROJECT;

  let disbursedAmount = 0;
  project.milestones = project.milestones.map((m) => {
    if (m.id === milestoneId) {
      disbursedAmount = m.amount;
      return { ...m, status: 'DISBURSED' };
    }
    return m;
  });

  project.budget.disbursed += disbursedAmount;

  // If next milestone exists, fund it on rail
  const nextPending = project.milestones.find((m) => m.status === 'PENDING');
  if (nextPending) {
    nextPending.status = 'FUNDED_ON_RAIL';
    project.budget.activeRailAmount = nextPending.amount;
  } else {
    // All milestones disbursed -> project recorded and closed out
    project.lifecycleState = 'RECORDED';
    project.telemetry.benchmarkContributionStatus = 'RECORDED';
  }

  projects[projectId] = project;
  saveProjects(projects);
  return { ...project };
}

export function submitContractorBid(
  projectId: string,
  bid: { contractorName: string; license: string; amount: number; specialty: string }
): SocioProject {
  const projects = getStoredProjects();
  const project = projects[projectId] || CANONICAL_PROJECT;

  const newCandidate: ContractorCandidate = {
    id: `CREW-${Math.floor(10 + Math.random() * 90)}`,
    name: bid.contractorName,
    license: bid.license || 'NYC DOB Lic #Verified',
    specialty: bid.specialty || 'General Renovation',
    fitScore: 91,
    completedJobs: 8,
    borough: project.property.borough,
    bidAmount: bid.amount,
    bidStatus: 'SUBMITTED',
  };

  project.contractors.push(newCandidate);
  project.lifecycleState = 'MATCHED';

  projects[projectId] = project;
  saveProjects(projects);
  return { ...project };
}
