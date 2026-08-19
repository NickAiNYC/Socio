// Socio Client API Layer
const API_BASE = import.meta.env?.VITE_API_BASE_URL || window.location.origin;

export async function fetchFleetStatus(token) {
  const res = await fetch(`${API_BASE}/api/agents/status`, {
    headers: { 'Authorization': `Bearer ${token || ''}` }
  });
  return res.json();
}

export async function fetchEvidence(businessId, token) {
  const res = await fetch(`${API_BASE}/api/merchant/${businessId}/evidence`, {
    headers: { 'Authorization': `Bearer ${token || ''}` }
  });
  return res.json();
}

export async function triggerAgent(agentId, businessId, token) {
  const res = await fetch(`${API_BASE}/api/agent/${agentId}/trigger`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ businessId })
  });
  return res.json();
}

export async function approveProposal(proposalId, token) {
  const res = await fetch(`${API_BASE}/api/governor/${proposalId}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token || ''}` }
  });
  return res.json();
}

export async function rejectProposal(proposalId, token) {
  const res = await fetch(`${API_BASE}/api/governor/${proposalId}/reject`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token || ''}` }
  });
  return res.json();
}
