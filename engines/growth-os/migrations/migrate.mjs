import pg from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MIGRATIONS_DIR = __dirname; // migrate.mjs lives inside migrations/

/**
 * Applies pending SQL migrations in filename order. Each migration runs in its
 * own transaction and is recorded in schema_migrations. Failure rolls back.
 * @param {import('pg').Pool} pool
 */
export async function runMigrations(pool, migrationsDir = MIGRATIONS_DIR) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const applied = [];
  for (const file of files) {
    const version = file.replace(/\.sql$/, '');
    const { rows } = await pool.query(
      'SELECT 1 FROM schema_migrations WHERE version = $1',
      [version]
    );
    if (rows.length > 0) continue;

    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
      await client.query('COMMIT');
      applied.push(version);
    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(`migration ${version} failed: ${err.message}`, { cause: err });
    } finally {
      client.release();
    }
  }

  return applied;
}

// CLI: node scripts/migrate-db.mjs  (requires DATABASE_URL)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.env.DATABASE_URL) {
    console.error('migrate-db: DATABASE_URL is required');
    process.exit(1);
  }
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const applied = await runMigrations(pool);
    console.log(applied.length ? `applied: ${applied.join(', ')}` : 'up to date');
  } finally {
    await pool.end();
  }
}
