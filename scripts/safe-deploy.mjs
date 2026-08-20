#!/usr/bin/env node
/**
 * safe-deploy.mjs — Socio deploy guard
 *
 * Blocks `vercel --prod` if the working tree is dirty or if the local HEAD
 * is not yet pushed to origin/main. Prevents the git/production flip-flop
 * pattern where dirty CLI deploys overwrite each other's work.
 *
 * Usage:  npm run deploy
 * Escape: SOCIO_ALLOW_DIRTY_DEPLOY=1 npm run deploy
 */
import { execSync } from 'child_process';

const allowDirty = process.env.SOCIO_ALLOW_DIRTY_DEPLOY === '1';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

if (!allowDirty) {
  // 1. Working tree must be clean
  const status = run('git status --porcelain');
  if (status) {
    console.error('\n❌  Deploy blocked: working tree is dirty.\n');
    console.error('    Commit or stash your changes first, or set');
    console.error('    SOCIO_ALLOW_DIRTY_DEPLOY=1 to bypass.\n');
    console.error('Dirty files:\n' + status);
    process.exit(1);
  }

  // 2. Local HEAD must be on origin/main (pushed)
  const localHead  = run('git rev-parse HEAD');
  const remoteHead = run('git ls-remote origin main').split('\t')[0];
  if (localHead !== remoteHead) {
    console.error('\n❌  Deploy blocked: local HEAD is not on origin/main.\n');
    console.error(`    local:  ${localHead}`);
    console.error(`    remote: ${remoteHead}`);
    console.error('\n    Push first, or set SOCIO_ALLOW_DIRTY_DEPLOY=1 to bypass.\n');
    process.exit(1);
  }

  console.log(`✅  Clean deploy from ${localHead.slice(0, 7)} (matches origin/main).`);
}

// All checks passed — shell out to vercel
try {
  execSync('npx vercel --prod --yes', { stdio: 'inherit' });
} catch (e) {
  process.exit(e.status ?? 1);
}
