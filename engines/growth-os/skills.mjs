/**
 * Skills system — vertical expertise encoded as SKILL.md files that
 * auto-activate from merchant context (vertical + dormant-customer count).
 *
 * A skill is a directory containing a SKILL.md with YAML-ish frontmatter:
 *
 *   ---
 *   name: florist-recovery
 *   description: Reactivate dormant florist customers
 *   vertical: florist
 *   min_dormant_count: 100
 *   whenToUse: A florist has 100+ dormant customers
 *   ---
 *
 * followed by the skill body (segmentation, offers, channels, attribution
 * window, rules). Agents load the selected skill body and follow it — the
 * skill is the mechanism that turns one merchant's learnings into a
 * repeatable process for the next.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

function parseFrontmatter(text) {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?/.exec(text);
  const meta = {};
  if (!m) return meta;
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (value === '') continue;
    meta[key] = value;
  }
  return meta;
}

/**
 * Loads all skills from a directory tree (one level deep).
 * @param {string} dir
 * @returns {Promise<Array<{id: string, name: string, description: string,
 *   vertical: string|null, minDormantCount: number|null, whenToUse: string,
 *   path: string, body: string}>>}
 */
export async function loadSkills(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(dir, entry.name);
    let raw;
    try {
      raw = await readFile(path.join(skillPath, 'SKILL.md'), 'utf8');
    } catch {
      continue; // directory without SKILL.md is not a skill
    }
    const meta = parseFrontmatter(raw);
    const min = meta.min_dormant_count === undefined ? null : Number(meta.min_dormant_count);
    skills.push({
      id: meta.name || entry.name,
      name: meta.name || entry.name,
      description: meta.description || '',
      vertical: meta.vertical || null,
      minDormantCount: Number.isFinite(min) ? min : null,
      whenToUse: meta.whenToUse || '',
      path: skillPath,
      body: raw,
    });
  }
  return skills.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Auto-activation: returns the skills applicable to a merchant profile.
 * Matching is conservative — a skill with a `vertical` only activates for
 * that vertical, and `min_dormant_count` must be met.
 * @param {{vertical?: string|null, dormantCount?: number}} profile
 * @param {string} dir
 * @returns {Promise<Array<{id: string, name: string, reason: string}>>}
 */
export async function selectSkills({ vertical = null, dormantCount = 0 } = {}, dir) {
  const all = await loadSkills(dir);
  return all
    .filter((s) => (!s.vertical || s.vertical === vertical) && (s.minDormantCount === null || dormantCount >= s.minDormantCount))
    .map((s) => ({
      id: s.id,
      name: s.name,
      reason: `vertical ${s.vertical ?? 'any'} · dormant ${dormantCount}${s.minDormantCount === null ? '' : ` >= ${s.minDormantCount}`}`,
    }));
}

/**
 * Fetches the full body of a skill by id (for agents to follow).
 * @param {string} id
 * @param {string} dir
 */
export async function getSkillBody(id, dir) {
  const all = await loadSkills(dir);
  const skill = all.find((s) => s.id === id);
  return skill ? { id: skill.id, name: skill.name, description: skill.description, body: skill.body } : null;
}
