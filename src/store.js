// Socio Client Persistence Store
export const store = {
  getTasks: () => JSON.parse(localStorage.getItem('socio_gem_tasks') || 'null'),
  saveTasks: (tasks) => localStorage.setItem('socio_gem_tasks', JSON.stringify(tasks)),
  
  getDecisions: () => JSON.parse(localStorage.getItem('socio_gov_decisions') || '{}'),
  saveDecision: (id, status) => {
    const d = store.getDecisions();
    d[id] = status;
    localStorage.setItem('socio_gov_decisions', JSON.stringify(d));
  },

  getToken: () => localStorage.getItem('socio_merchant_token') || 'dev-token',
  setToken: (tok) => localStorage.setItem('socio_merchant_token', tok)
};
