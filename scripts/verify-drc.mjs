import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(readFileSync(`${root}manifest.json`))
execFileSync('bun', [`${root}.cache/autorouter/verify-drc-worker.ts`, root, '7'], { stdio: 'inherit' })
if (manifest.additionalAudit) execFileSync('bun', [`${root}.cache/pipeline9/verify-drc-worker.ts`, root, '9'], { stdio: 'inherit' })
