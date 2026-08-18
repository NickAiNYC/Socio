const http = require('http');
const { execFile } = require('child_process');

const PORT = process.env.WEBHOOK_PORT || 3001;

http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const lead = JSON.parse(body);
        
        console.log('Received Lead:', lead);

        if (req.url === '/api/leads') {
          // Create Kanban task in Hermes
          const args = ['kanban', 'create', `Lead: ${lead.name} — ${lead.type}`, '--assignee', 'socio-prospect', '--board', 'socio'];
          
          execFile('hermes', args, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing hermes: ${error}`);
            } else {
              console.log(`Kanban task created: ${stdout}`);
            }
          });
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success', message: 'Lead captured' }));
        } else if (req.url === '/api/analytics/pageview' || req.url === '/api/analytics/event') {
          // Lightweight analytics dump
          console.log('Analytics Event:', lead);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success' }));
        } else if (req.url === '/api/referrals/visit') {
          console.log('Referral Visit:', lead);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success' }));
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      } catch (e) {
        console.error('Error parsing JSON', e);
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
}).listen(PORT, () => {
  console.log(`Socio Webhook receiver running on port ${PORT}`);
});
