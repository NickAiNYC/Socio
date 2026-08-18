import test from 'node:test';
import assert from 'node:assert/strict';
import { BusinessTwin } from '../business-twin.mjs';
import { BusinessTwinMemoryRepository } from '../repositories/memory-repository.mjs';
import { BusinessTwinConflictError } from '../errors.mjs';

test('BusinessTwin - initialization', async () => {
  const repo = new BusinessTwinMemoryRepository();
  const twin = new BusinessTwin(repo);

  const state = await twin.initialize('biz_1', { name: 'Cristal Flowers' });
  assert.equal(state.name, 'Cristal Flowers');
  assert.equal(state.id, 'biz_1');
});

test('BusinessTwin - prevents duplicate initialization', async () => {
  const repo = new BusinessTwinMemoryRepository();
  const twin = new BusinessTwin(repo);

  await twin.initialize('biz_1', { name: 'Cristal Flowers' });
  await assert.rejects(
    twin.initialize('biz_1', { name: 'Another Name' }),
    BusinessTwinConflictError
  );
});

test('BusinessTwin - nested patch and history', async () => {
  const repo = new BusinessTwinMemoryRepository();
  const twin = new BusinessTwin(repo);

  await twin.initialize('biz_1', { name: 'Cristal Flowers', active: true });
  await twin.patch('biz_1', { active: false }, 'system', 'Paused business');

  const current = await twin.get('biz_1');
  assert.equal(current.active, false);

  const history = await twin.history('biz_1');
  assert.equal(history.length, 2); // Init + Patch
  assert.equal(history[0].active, true);
  assert.equal(history[1].active, false);
});
