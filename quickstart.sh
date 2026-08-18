#!/bin/bash
# Quickstart: Clone and deploy Socio OS on a fresh machine

echo "🚀 Deploying Socio Operating System..."

# 1. Clone the repo (if not already done)
if [ ! -d "socio-os" ]; then
  git clone https://github.com/NickAiNYC/Socio.git socio-os
  cd socio-os
fi

# 2. Copy environment variables
cp .env.example .env
echo "⚠️  Edit .env with your API keys (DeepSeek, Stripe, etc.)"

# 3. Run the VPS setup
chmod +x deploy_vps.sh
./deploy_vps.sh

# 4. Deploy DSH
chmod +x setup_dsh.sh
./setup_dsh.sh

# 5. Deploy Hermes fleet
chmod +x init_hermes_fleet.sh
./init_hermes_fleet.sh

# 6. Deploy website
if [ -d "website" ]; then
  cd website && ./deploy-website.sh
fi

echo "✅ Socio OS is live!"
echo "📊 Website: https://socio.nyc"
echo "🤖 DSH UI: http://localhost:3080"
echo "📋 Hermes: Run 'hermes bot list' to verify agents"
