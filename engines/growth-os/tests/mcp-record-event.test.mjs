import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(__dirname, '..', 'mcp-server.mjs');

async function withServer(env, fn) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [SERVER],
    env: { ...process.env, DATABASE_URL: '', GROWTH_OS_ALLOW_MEMORY: 'true', ...env },
  });
  const client = new Client({ name: 'record-event-test', version: '1.0.0' });
  await client.connect(transport);
  try {
    await fn(client);
  } finally {
    await client.close();
  }
}

async function callTool(client, name, args) {
  const res = await client.callTool({ name, arguments: args });
  return { isError: res.isError === true, text: res.content?.[0]?.text ?? '' };
}

async function proposeAndExecute(client, payload) {
  const p = await callTool(client, 'growth_os_propose_action', {
    businessId: 'biz_A',
    agentId: 'agent_a',
    type: 'spend',
    risk: 'LOW',
    objective: 'ad spend',
    expectedOutcome: 'reach',
    payload,
    evidence: 'unit test',
  });
  assert.equal(p.isError, false, `propose failed: ${p.text}`);
  const proposalId = JSON.parse(p.text).proposalId;
  const ex = await callTool(client, 'growth_os_execute_action', {
    businessId: 'biz_A',
    agentId: 'agent_a',
    proposalId,
    actionType: 'spend',
    payload,
  });
  assert.equal(ex.isError, false, `execute failed: ${ex.text}`);
  return proposalId;
}

// ---------------------------------------------------------------------------
// Economic-event authorization: an executed approval must EXPLICITLY bound the
// event types and the max amount. An approval for "spend" cannot be reused to
// book arbitrary revenue.
// ---------------------------------------------------------------------------

test('RECORD_EVENT: financial event within an approved bound is recorded', async () => {
  await withServer({}, async (client) => {
    const proposalId = await proposeAndExecute(client, { maxAmount: 500, allowedEventTypes: ['campaign_cost'] });
    const res = await callTool(client, 'growth_os_record_event', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      actionId: proposalId,
      type: 'campaign_cost',
      amount: 100,
      currency: 'USD',
      source: 'test',
    });
    assert.equal(res.isError, false, `bounded campaign_cost should record: ${res.text}`);
  });
});

test('RECORD_EVENT: amount above the approved maxAmount is rejected', async () => {
  await withServer({}, async (client) => {
    const proposalId = await proposeAndExecute(client, { maxAmount: 500, allowedEventTypes: ['campaign_cost'] });
    const res = await callTool(client, 'growth_os_record_event', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      actionId: proposalId,
      type: 'campaign_cost',
      amount: 999,
      currency: 'USD',
      source: 'test',
    });
    assert.equal(res.isError, true, 'amount above maxAmount must be rejected');
    assert.match(res.text, /exceeds the approved maxAmount/);
  });
});

test('RECORD_EVENT: event type not declared in the approval is rejected', async () => {
  await withServer({}, async (client) => {
    const proposalId = await proposeAndExecute(client, { maxAmount: 500, allowedEventTypes: ['campaign_cost'] });
    const res = await callTool(client, 'growth_os_record_event', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      actionId: proposalId,
      type: 'revenue',
      amount: 100,
      currency: 'USD',
      source: 'test',
    });
    assert.equal(res.isError, true, 'undeclared event type must be rejected');
    assert.match(res.text, /does not authorize this event type/);
  });
});

test('RECORD_EVENT: financial event against an approval with no bound declaration fails closed', async () => {
  await withServer({}, async (client) => {
    // An executed approval whose payload does NOT declare allowedEventTypes/maxAmount.
    const p = await callTool(client, 'growth_os_propose_action', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      type: 'send_email',
      risk: 'LOW',
      objective: 'x',
      expectedOutcome: 'y',
      payload: { to: 'merchant@example.com' },
      evidence: 'unit test',
    });
    const proposalId = JSON.parse(p.text).proposalId;
    await callTool(client, 'growth_os_execute_action', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      proposalId,
      actionType: 'send_email',
      payload: { to: 'merchant@example.com' },
    });

    const res = await callTool(client, 'growth_os_record_event', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      actionId: proposalId,
      type: 'revenue',
      amount: 1000000,
      currency: 'USD',
      source: 'test',
    });
    assert.equal(res.isError, true, 'a send_email approval must never authorize revenue booking');
    assert.match(res.text, /allowedEventTypes/);
  });
});

test('RECORD_EVENT: agentId is required when GROWTH_OS_AUTH_TOKENS is configured', async () => {
  await withServer({ GROWTH_OS_AUTH_TOKENS: JSON.stringify({ agent_a: 'tok_a' }) }, async (client) => {
    const res = await callTool(client, 'growth_os_record_event', {
      businessId: 'biz_A',
      type: 'lead_created',
      amount: 0,
      currency: 'USD',
      source: 'test',
    });
    assert.equal(res.isError, true, 'missing agentId with tokens configured must fail');
    assert.match(res.text, /agentId is required/);
  });
});

// ---------------------------------------------------------------------------
// AUTH_TOKENS config integrity — fail closed on misconfiguration.
// ---------------------------------------------------------------------------

function spawnServer(env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [SERVER], {
      env: { ...process.env, DATABASE_URL: '', GROWTH_OS_ALLOW_MEMORY: 'true', ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { out += d; });
    child.on('exit', (code) => resolve({ code, out }));
    setTimeout(() => { child.kill('SIGKILL'); resolve({ code: null, out }); }, 5000);
  });
}

test('AUTH: duplicate token values fail closed at boot', async () => {
  const { code, out } = await spawnServer({ GROWTH_OS_AUTH_TOKENS: JSON.stringify({ a: 'same', b: 'same' }) });
  assert.notEqual(code, 0, 'server must refuse duplicate token values');
  assert.match(out, /duplicate token values/);
});

test('AUTH: empty token values fail closed at boot', async () => {
  const { code, out } = await spawnServer({ GROWTH_OS_AUTH_TOKENS: JSON.stringify({ a: '' }) });
  assert.notEqual(code, 0, 'server must refuse empty token values');
  assert.match(out, /empty token/);
});
