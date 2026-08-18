#!/bin/bash
set -e

echo "🚀 Initializing Socio Operating System - DSH Build Layer..."

# Ensure we are in the correct directory
cd "$(dirname "$0")"

echo "📦 Installing local dependencies..."
npm install

echo "🔌 Installing essential DSH plugins..."
npx dsh plugin add dsh-agent-teams
npx dsh plugin add dsh-team
npx dsh plugin add dsh-plugin-subagents
npx dsh plugin add dsh-dag-orchestrator
npx dsh plugin add dsh-plan-execute
npx dsh plugin add dsh-memory-evolve
npx dsh plugin add dsh-worktrees
npx dsh plugin add dsh-crew
npx dsh plugin add dsh-model-switch

echo "✅ DSH Setup Complete."
echo "You can now run 'npx dsh --system-prompt ./agents/socio-system-prompt.txt' to start the local DeepSeek Harness environment."
