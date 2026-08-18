import test from 'node:test';
import assert from 'node:assert/strict';
import { ExperimentEngine } from '../experiment-engine.mjs';
import { MemoryRepository } from '../repositories/memory-repository.mjs';

test('ExperimentEngine - lifecycle', async () => {
  const repo = new MemoryRepository();
  const engine = new ExperimentEngine(repo);

  const exp = await engine.createExperiment({
    businessId: 'biz_1',
    hypothesis: 'Test',
    objective: 'Increase clicks',
    metric: 'ctr',
    baseline: 0.05,
    variants: ['A', 'B']
  });

  assert.equal(exp.status, 'DRAFT');

  await engine.startExperiment(exp.id);
  const running = await engine.getExperiment(exp.id);
  assert.equal(running.status, 'RUNNING');

  await engine.pauseExperiment(exp.id);
  const paused = await engine.getExperiment(exp.id);
  assert.equal(paused.status, 'PAUSED');
  
  await engine.startExperiment(exp.id); // resume

  // Add observations
  for (let i=0; i<105; i++) {
    await engine.observe(exp.id, { value: 0.06 }); // better than baseline
  }

  const evaluation = await engine.evaluate(exp.id);
  assert.equal(evaluation.result, 'PROMOTABLE');

  await engine.promote(exp.id, 'Statistically significant improvement');
  const promoted = await engine.getExperiment(exp.id);
  assert.equal(promoted.status, 'PROMOTED');
});
