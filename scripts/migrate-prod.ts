#!/usr/bin/env bun

/**
 * scripts/migrate-prod.ts
 *
 * Usage:
 *   bun run scripts/migrate-prod.ts
 *   bun run scripts/migrate-prod.ts "postgres://user:pass@host/db?sslmode=require"   # explicit override
 *   DATABASE_URL="postgres://..." bun run scripts/migrate-prod.ts                    # already-exported env var
 *
 * What it does:
 *   1. Resolves DATABASE_URL, checked in this order:
 *        a. CLI argument (explicit override)
 *        b. process.env.DATABASE_URL (already exported in the shell)
 *        c. The first .env-style file (at the repo root) that defines DATABASE_URL,
 *           searched in this order: .env.local, .env.prod, .env.production, .env
 *   2. Upserts it into apps/server/.env (preserving other existing vars there)
 *   3. Runs the db migration command against packages/db, using that URL
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseEnv } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
// scripts/ lives at repo root, so repoRoot is one level up
const repoRoot = resolve(__dirname, '..')
const serverEnvPath = resolve(repoRoot, 'apps/server/.env')
const dbPackageDir = resolve(repoRoot, 'packages/db')

// Order matters: most-specific/local override first.
const ENV_FILE_CANDIDATES = [
	'.env.local',
	'.env.prod',
	'.env.production',
	'.env',
]

/**
 * Look for DATABASE_URL across process.env and known .env files at the repo root.
 * Returns the value plus where it was found (for logging).
 */
function findDatabaseUrl(): { value: string; source: string } | undefined {
	if (process.env.DATABASE_URL) {
		return { value: process.env.DATABASE_URL, source: 'process.env' }
	}

	for (const fileName of ENV_FILE_CANDIDATES) {
		const filePath = resolve(repoRoot, fileName)
		if (!existsSync(filePath)) continue

		const parsed = parseEnv(readFileSync(filePath, 'utf8'))
		if (parsed.DATABASE_URL) {
			return { value: parsed.DATABASE_URL, source: fileName }
		}
	}

	return undefined
}

/**
 * Insert or update a KEY=value line in a .env file without touching
 * any other existing variables.
 */
function upsertEnvVar(filePath: string, key: string, value: string) {
	const existing = existsSync(filePath) ? readFileSync(filePath, 'utf8') : ''
	const lines = existing.length ? existing.split('\n') : []

	const keyPattern = new RegExp(`^${key}=`)
	const newLine = `${key}="${value}"`
	const idx = lines.findIndex(line => keyPattern.test(line))

	if (idx >= 0) {
		lines[idx] = newLine
	} else {
		// drop a single trailing empty line before appending, if present
		if (lines.length && lines[lines.length - 1] === '') lines.pop()
		lines.push(newLine)
	}

	writeFileSync(filePath, `${lines.join('\n').trimEnd()}\n`, 'utf8')
}

function isValidPostgresUrl(url: string) {
	return /^postgres(ql)?:\/\/.+/.test(url)
}

function main() {
	const cliArg = process.argv[2]
	const found = cliArg
		? { value: cliArg, source: 'CLI argument' }
		: findDatabaseUrl()

	if (!found) {
		console.error('❌ Could not find DATABASE_URL.')
		console.error(
			'Checked (in order): CLI arg, process.env, then these files at the repo root:',
		)
		for (const f of ENV_FILE_CANDIDATES) console.error(`  - ${f}`)
		console.error('')
		console.error('Usage:')
		console.error(
			'  bun run scripts/migrate-prod.ts                          # auto-detect',
		)
		console.error(
			'  bun run scripts/migrate-prod.ts "postgres://user:pass@host/db"',
		)
		console.error(
			'  DATABASE_URL="postgres://..." bun run scripts/migrate-prod.ts',
		)
		process.exit(1)
	}

	const { value: databaseUrl, source } = found

	if (!isValidPostgresUrl(databaseUrl)) {
		console.error(
			`❌ Value found in ${source} does not look like a valid postgres connection string.`,
		)
		process.exit(1)
	}

	console.log(`→ Found DATABASE_URL in ${source}`)

	if (!existsSync(dbPackageDir)) {
		console.error(`❌ Could not find packages/db at ${dbPackageDir}`)
		process.exit(1)
	}

	console.log(`→ Writing DATABASE_URL to ${serverEnvPath}`)
	upsertEnvVar(serverEnvPath, 'DATABASE_URL', databaseUrl)

	console.log('→ Running production migration (packages/db)...')
	const result = spawnSync('bun', ['run', 'db:migrate'], {
		cwd: dbPackageDir,
		stdio: 'inherit',
		env: {
			...process.env,
			DATABASE_URL: databaseUrl,
		},
	})

	if (result.error) {
		console.error('❌ Failed to run migration command:', result.error.message)
		process.exit(1)
	}

	if (result.status !== 0) {
		console.error(`❌ Migration exited with code ${result.status}`)
		process.exit(result.status ?? 1)
	}

	console.log('✅ Migration complete.')
}

main()
