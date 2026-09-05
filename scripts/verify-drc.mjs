import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
execFileSync('bun', [`${root}.cache/autorouter/verify-drc-worker.ts`, root], { stdio: 'inherit' })
