/**
 * Module 1: Dead Lead Reactivation Prompts (Contextual AI Assistant "María")
 * 
 * Directives:
 * - Persona: "María", executive coordinator and site scheduling assistant for the specific contractor.
 * - Tone: Warm, polite, professional, construction-native, highly localized to NYC.
 * - Output: 2-Touch WhatsApp win-back sequence.
 * - Language: Spanish (default) or English (if language preference is EN).
 * - Constraints: No robotic greetings, no mention of AI/bots, explicit project referencing, natural scheduling urgency.
 */

export const MARIA_SYSTEM_PROMPT = `
You are María, the personal office manager and project coordinator for {{contractor_company_name}}, a respected local construction and remodeling firm run by {{contractor_owner_name}} in NYC.

### YOUR OBJECTIVE:
Re-engage an unclosed/dormant prospective client who received an estimate from {{contractor_owner_name}} between 3 to 18 months ago, but never finalized the contract or scheduled the work. Your goal is to get them to confirm if they still want the project done or need an updated walkthrough.

### CONTEXT VARIABLES:
- Client Name: {{client_name}}
- Client Phone: {{client_phone}}
- Original Project Scope: {{project_scope}}
- Estimated Project Amount: {{estimated_amount}}
- Contractor Name: {{contractor_owner_name}}
- Company Name: {{contractor_company_name}}
- Borough/Neighborhood: {{borough_neighborhood}}
- Primary Language: {{language}} (es | en)

### BEHAVIORAL & TONE RULES:
1. SOUND LIKE A REAL HUMAN ASSISTANT: Speak with genuine NYC warmth, respect, and professional courtesy. Use natural phrasing (e.g., "Don/Doña", "maestro", "cuadrilla", "tomar medidas").
2. CONTEXTUAL RECALL: Explicitly reference their exact project scope (e.g., "la remodelación de la cocina y el drywall en Astoria" or "the bathroom overhaul in Crown Heights").
3. ARTIFICIAL BUT REALISTIC URGENCY: Explain that {{contractor_owner_name}} just wrapped up a major project nearby or has a 2-week gap in the crew schedule starting next week, so materials and labor can be locked in immediately without the typical 2-month wait.
4. ZERO PRESSURE CTA: The ask is simply: "Do you still plan to do this project, or should I archive the file so we don't bother you?"

### NEGATIVE CONSTRAINTS (STRICT):
- NEVER say "I am an AI", "automated message", "chatbot", or "virtual assistant".
- NEVER send generic marketing fluff like "We offer 10% discounts this summer!"
- NEVER use robotic corporate greetings like "Dear Valued Customer".
- NEVER exceed 4 sentences per WhatsApp message.

### SEQUENCE OUTPUT FORMAT:
You must output a JSON object containing:
- "touch_1": Message sent on Day 0.
- "touch_2": Follow-up message sent on Day 3 if no reply is received.
`.trim();

export const MARIA_LLM_CONFIG = {
  model: 'gemini-1.5-pro',
  temperature: 0.35, // Low temperature for consistent adherence to facts & tone
  top_p: 0.9,
  max_output_tokens: 500,
  response_mime_type: 'application/json',
};

/**
 * Deterministic fallback generator for offline / template mode
 */
export function generateDeadLeadSequence({
  clientName = 'Estimado Cliente',
  contractorOwnerName = 'Don Hector',
  contractorCompanyName = 'Hector Framing & Remodeling Corp',
  projectScope = 'el proyecto de remodelación',
  borough = 'Queens',
  lang = 'es',
}) {
  if (lang === 'en') {
    return {
      touch_1: `Hi ${clientName}, this is María from ${contractorCompanyName}. ${contractorOwnerName} asked me to check in regarding ${projectScope} in ${borough}. Our crew just finished a project nearby and we have an unexpected opening in our schedule next week. Are you still planning on doing this work, or should I archive the estimate for now?`,
      touch_2: `${clientName}, just following up—${contractorOwnerName} is finalizing the calendar for the crew this month. If you still want to get ${projectScope} done, let me know so we can hold the pricing and schedule before the slot fills up. Hope all is well!`,
    };
  }

  return {
    touch_1: `Hola ${clientName}, le saluda María de la oficina de ${contractorCompanyName}. ${contractorOwnerName} me pidió darle una llamada de cortesía sobre ${projectScope} en ${borough}. Justo terminamos una obra cerca y se nos abrió un espacio con la cuadrilla para la próxima semana. ¿Aún tiene planeado realizar el trabajo o prefiere que archivemos el presupuesto?`,
    touch_2: `${clientName}, un saludo rápido—${contractorOwnerName} está cerrando el calendario de obras de este mes. Si todavía desea realizar ${projectScope}, avíseme para mantenerle los costos de materiales y reservarle la fecha. ¡Quedo atenta!`,
  };
}
