import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync, copyFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
const runtime = `${root}.cache/autorouter`
const manifest = JSON.parse(readFileSync(`${root}manifest.json`))
mkdirSync(`${root}.cache`, { recursive: true })
if (!existsSync(`${runtime}/.git`)) execFileSync('git', ['clone', '--no-checkout', manifest.router.repository, runtime], { stdio: 'inherit' })
execFileSync('git', ['checkout', '--detach', manifest.router.commit], { cwd: runtime, stdio: 'inherit' })
copyFileSync(`${root}scripts/runtime.bun.lock`, `${runtime}/bun.lock`)
execFileSync('bun', ['install', '--frozen-lockfile'], { cwd: runtime, stdio: 'inherit' })
for (const name of ['audit-report.ts', 'verify-drc-worker.ts']) copyFileSync(`${root}scripts/${name}`, `${runtime}/${name}`)
console.log(`Runtime ready at ${manifest.router.commit}`)
