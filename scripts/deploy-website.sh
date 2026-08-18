#!/bin/bash
set -e

# Socio OS: Website Deployment Script
# Deploys socio.nyc to the DigitalOcean VPS and configures Nginx/SSL.

# Load environment variables
if [ -f ../.env ]; then
  source ../.env
fi

if [ -z "$VPS_IP" ]; then
  echo "❌ Error: VPS_IP not set in .env"
  exit 1
fi

echo "🚀 Deploying socio.nyc to $VPS_IP..."

# RSYNC website files to VPS
rsync -avz --delete ../website/ root@$VPS_IP:/var/www/socio.nyc/

# Execute remote commands
ssh root@$VPS_IP << 'EOF'
  echo "🔧 Configuring Nginx..."
  cat << 'NGINX' > /etc/nginx/sites-available/socio.nyc
server {
    listen 80;
    server_name socio.nyc www.socio.nyc;
    root /var/www/socio.nyc;
    index index.html;
    location / {
        try_files $uri $uri/ =404;
    }
}
NGINX

  ln -sf /etc/nginx/sites-available/socio.nyc /etc/nginx/sites-enabled/
  systemctl restart nginx

  echo "🔒 Requesting SSL Certificate (if not present)..."
  if ! certbot certificates | grep -q "socio.nyc"; then
    certbot --nginx -d socio.nyc -d www.socio.nyc --non-interactive --agree-tos -m admin@socio.nyc
  else
    echo "SSL Certificate already exists."
  fi
EOF

echo "✅ Website successfully deployed to https://socio.nyc"
