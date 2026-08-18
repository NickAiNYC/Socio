/**
 * Merchant Evidence API — read-only reporting surface for merchants.
 *
 * Serves the Merchant Evidence Layer over HTTP:
 *
 *   GET  /api/health
 *   GET  /api/merchant/:businessId/evidence        full six-question report
 *   GET  /api/merchant/:businessId/actions         what did Socio do
 *   GET  /api/merchant/:businessId/revenue         what happened + revenue followed
 *   GET  /api/merchant/:businessId/attribution     what we can/cannot prove
 *   GET  /api/merchant/:businessId/experiments     experiments
 *   GET  /api/merchant/:businessId/approvals       governor approval registry
 *   GET  /api/merchant/:businessId/audit           audit chain (business slice)
 *   POST /api/merchant/:businessId/audit/verify    hash-chain verification (global)
 *   GET  /api/merchant/:businessId/system          stripe + system state
 *
 * Security model:
 *   - per-business bearer tokens (MERCHANT_API_TOKENS={"businessId":"token"});
 *     when configured, every request must authenticate AND the path businessId
 *     must equal the token's businessId (403 otherwise)
 *   - business isolation is server-side: every read is scoped by businessId at
 *     the repository boundary (findByBusiness / getByBusiness)
 *   - read-only: no mutation endpoints exist
 *   - fail-closed boot: DATABASE_URL required unless GROWTH_OS_ALLOW_MEMORY=true
 *   - binds 127.0.0.1 by default (override with MERCHANT_API_HOST for LAN/prod)
 */
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { BusinessTwin } from '../business-twin.mjs';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { AgentGovernor } from '../agent-governor.mjs';
import { AuditTrail } from '../audit-trail.mjs';
import { ExperimentEngine } from '../experiment-engine.mjs';
import { BusinessTwinMemoryRepository, MemoryRepository } from '../repositories/memory-repository.mjs';
import { PostgresRepository, BusinessTwinPostgresRepository } from '../repositories/postgres-repository.mjs';
import { MemoryEconomicStore, PostgresEconomicStore } from '../economic/economic-store.mjs';
import { buildMerchantEvidenceReport, verifyMerchantAuditChain, computeStripeState } from './evidence-report.mjs';

const PORT = Number(process.env.MERCHANT_API_PORT || 8787);
const HOST = process.env.MERCHANT_API_HOST || '127.0.0.1';
const CORS_ORIGIN = process.env.MERCHANT_API_CORS_ORIGIN || '*';

/**
 * @param {object} deps
 * @param {import('../business-twin.mjs').BusinessTwin} deps.businessTwin
 * @param {import('../revenue-ledger.mjs').RevenueLedger} deps.revenueLedger
 * @param {import('../audit-trail.mjs').AuditTrail} deps.auditTrail
 * @param {import('../experiment-engine.mjs').ExperimentEngine} deps.experimentEngine
 * @param {import('../economic/economic-store.mjs').MemoryEconomicStore|import('../economic/economic-store.mjs').PostgresEconomicStore} deps.economicStore
 * @param {import('../agent-governor.mjs').AgentGovernor} deps.agentGovernor
 * @param {Record<string,string>|null} [deps.tokens] businessId -> token map
 * @param {boolean} [deps.stripeSecretConfigured=false]
 * @returns {import('node:http').Server}
 */
export function createMerchantApi({
  businessTwin,
  revenueLedger,
  auditTrail,
  experimentEngine,
  economicStore,
  agentGovernor,
  tokens = null,
  stripeSecretConfigured = false,
}) {
  const tokenToBusiness = tokens ? new Map(Object.entries(tokens).map(([biz, tok]) => [tok, biz])) : null;

  function bearerToken(req) {
    const header = req.headers.authorization || '';
    const m = /^Bearer\s+(.+)$/i.exec(header);
    return m ? m[1].trim() : null;
  }

  function sendJson(res, status, payload) {
    const body = JSON.stringify(payload, null, 2);
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  }

  function sendError(res, status, code, message) {
    sendJson(res, status, { error: { code, message } });
  }

  async function buildReport(businessId) {
    return buildMerchantEvidenceReport({
      businessTwin,
      revenueLedger,
      auditTrail,
      experimentEngine,
      economicStore,
      agentGovernor,
      businessId,
      stripeSecretConfigured,
    });
  }

  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': CORS_ORIGIN,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        });
        res.end();
        return;
      }

      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const parts = url.pathname.split('/').filter(Boolean); // [api, merchant, businessId, resource, ...]

      if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'health') {
        sendJson(res, 200, { status: 'ok', service: 'merchant-evidence-api', time: new Date().toISOString() });
        return;
      }

      if (parts[0] !== 'api' || parts[1] !== 'merchant') {
        sendError(res, 404, 'not_found', 'unknown route');
        return;
      }

      const businessId = parts[2];
      const resource = parts[3];
      const action = parts[4];

      if (!businessId || !resource) {
        sendError(res, 400, 'bad_request', 'expected /api/merchant/:businessId/:resource');
        return;
      }

      // --- Authentication + business binding (when tokens configured) ---
      if (tokenToBusiness) {
        const token = bearerToken(req);
        const callerBusiness = token ? tokenToBusiness.get(token) : undefined;
        if (!callerBusiness) {
          sendError(res, 401, 'unauthorized', 'missing or invalid bearer token');
          return;
        }
        if (callerBusiness !== businessId) {
          sendError(res, 403, 'forbidden', `token is bound to business ${callerBusiness}, not ${businessId}`);
          return;
        }
      }

      // --- Route dispatch (report built lazily; /audit and /system read only what they need) ---
      if (req.method === 'GET' && resource === 'audit' && !action) {
        const entries = (await auditTrail.getLogs({ businessId })).map((a) => ({
          id: a.id,
          proposalId: a.proposalId,
          agentId: a.agentId,
          actionType: a.actionType,
          status: a.status,
          timestamp: a.timestamp,
        }));
        const verify = await verifyMerchantAuditChain(auditTrail);
        sendJson(res, 200, { businessId, generatedAt: new Date().toISOString(), entries, verify });
        return;
      }
      if (req.method === 'POST' && resource === 'audit' && action === 'verify') {
        const verify = await verifyMerchantAuditChain(auditTrail);
        sendJson(res, 200, { businessId, generatedAt: new Date().toISOString(), verify });
        return;
      }
      if (req.method === 'GET' && resource === 'system') {
        const events = await revenueLedger.getEvents({ businessId });
        const stripe = computeStripeState({
          secretConfigured: stripeSecretConfigured,
          stripeEventCount: events.filter((e) => e.source === 'stripe').length,
        });
        sendJson(res, 200, {
          businessId,
          generatedAt: new Date().toISOString(),
          stripe,
          system: {
            persistence: revenueLedger.repository.constructor.name.includes('Postgres') ? 'postgres' : 'memory',
            stripeSecretConfigured: Boolean(stripeSecretConfigured),
            health: 'ok',
          },
        });
        return;
      }

      const report = await buildReport(businessId);

      if (req.method === 'GET' && resource === 'evidence') {
        sendJson(res, 200, report);
        return;
      }
      if (req.method === 'GET' && resource === 'actions') {
        sendJson(res, 200, { businessId, generatedAt: report.generatedAt, ...report.questions.whatDidSocioDo });
        return;
      }
      if (req.method === 'GET' && resource === 'revenue') {
        sendJson(res, 200, { businessId, generatedAt: report.generatedAt, ...report.questions.whatHappened, followed: report.questions.whatRevenueFollowed });
        return;
      }
      if (req.method === 'GET' && resource === 'attribution') {
        sendJson(res, 200, { businessId, generatedAt: report.generatedAt, attributable: report.questions.whatCanWeAttribute, notProvable: report.questions.whatCantWeProve, methodology: report.methodology });
        return;
      }
      if (req.method === 'GET' && resource === 'experiments') {
        sendJson(res, 200, { businessId, generatedAt: report.generatedAt, experiments: report.questions.whatShouldSocioDoNext.experiments, learnings: report.questions.whatShouldSocioDoNext.learnings });
        return;
      }
      if (req.method === 'GET' && resource === 'approvals') {
        sendJson(res, 200, { businessId, generatedAt: report.generatedAt, ...report.approvals });
        return;
      }

      sendError(res, 404, 'not_found', `unknown merchant resource /${resource}${action ? '/' + action : ''}`);
    } catch (err) {
      sendError(res, 500, 'internal_error', err.message);
    }
  });

  return server;
}

/**
 * Production boot — same fail-closed discipline as the MCP server.
 */
export function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const ALLOW_MEMORY = process.env.GROWTH_OS_ALLOW_MEMORY === 'true';

  if (!DATABASE_URL && !ALLOW_MEMORY) {
    console.error(
      'Merchant API fails closed: DATABASE_URL is required for durable persistence. ' +
      'Set GROWTH_OS_ALLOW_MEMORY=true only for explicit in-memory test mode.'
    );
    process.exit(1);
  }

  let tokens = null;
  if (process.env.MERCHANT_API_TOKENS) {
    try {
      tokens = JSON.parse(process.env.MERCHANT_API_TOKENS);
    } catch {
      console.error('Merchant API fails closed: MERCHANT_API_TOKENS must be valid JSON ({"businessId":"token"}).');
      process.exit(1);
    }
  }

  let twinRepo;
  let ledgerRepo;
  let auditRepo;
  let approvalRepo;
  let experimentRepo;
  let economicStore;

  if (DATABASE_URL) {
    twinRepo = new BusinessTwinPostgresRepository();
    ledgerRepo = new PostgresRepository('revenue_ledger');
    auditRepo = new PostgresRepository('audit_trail');
    approvalRepo = new PostgresRepository('approvals');
    experimentRepo = new PostgresRepository('experiments');
    economicStore = new PostgresEconomicStore(DATABASE_URL);
  } else {
    twinRepo = new BusinessTwinMemoryRepository();
    ledgerRepo = new MemoryRepository();
    auditRepo = new MemoryRepository();
    approvalRepo = new MemoryRepository();
    experimentRepo = new MemoryRepository();
    economicStore = new MemoryEconomicStore();
  }

  const businessTwin = new BusinessTwin(twinRepo);
  const revenueLedger = new RevenueLedger(ledgerRepo);
  const auditTrail = new AuditTrail(auditRepo);
  const agentGovernor = new AgentGovernor([], approvalRepo);
  const experimentEngine = new ExperimentEngine(experimentRepo);

  const server = createMerchantApi({
    businessTwin,
    revenueLedger,
    auditTrail,
    experimentEngine,
    economicStore,
    agentGovernor,
    tokens,
    stripeSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
  });

  server.listen(PORT, HOST, () => {
    console.log(`Merchant Evidence API listening on http://${HOST}:${PORT}`);
    console.log(`  tokens: ${tokens ? 'configured (' + Object.keys(tokens).length + ' business(es))' : 'DISABLED — local mode, no auth'}`);
    console.log(`  stripe: ${process.env.STRIPE_WEBHOOK_SECRET ? 'secret configured' : 'disconnected'}`);
    console.log(`  persistence: ${DATABASE_URL ? 'postgres' : 'memory'}`);
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main();
}
