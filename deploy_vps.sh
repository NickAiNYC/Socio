#!/bin/bash
set -e

echo "🚀 Provisioning DigitalOcean VPS for Socio Operations..."

# Run this script as root on a fresh Ubuntu 22.04 Droplet

# 1. System Updates
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y
apt-get install -y git curl ufw

# 2. Firewall Configuration
echo "🛡️ Configuring Firewall (UFW)..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp # Helio UI port
ufw --force enable

# 3. Docker Installation
if ! command -v docker &> /dev/null
then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "✅ Docker is already installed."
fi

# 4. Helio Deployment
echo "🌐 Deploying Helio (Marketing Automation CDP)..."
if [ ! -d "/opt/helio" ]; then
    git clone https://github.com/achref-soua/helio /opt/helio
fi

cd /opt/helio
docker compose up -d

echo "✅ Deployment Complete!"
echo "Helio is now running on http://$(curl -s ifconfig.me):3000"
echo "Secure your droplet by creating a non-root user and setting up SSH keys."
