import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync, copyFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(readFileSync(`${root}manifest.json`))
const runtime = `${root}.cache/autorouter`
mkdirSync(`${root}.cache`, { recursive: true })
if (!existsSync(`${runtime}/.git`)) execFileSync('git', ['clone', '--no-checkout', manifest.router.repository, runtime], { stdio: 'inherit' })
execFileSync('git', ['checkout', '--detach', manifest.router.commit], { cwd: runtime, stdio: 'inherit' })
copyFileSync(`${root}scripts/runtime.bun.lock`, `${runtime}/bun.lock`)
execFileSync('bun', ['install', '--frozen-lockfile'], { cwd: runtime, stdio: 'inherit' })
for (const name of ['audit-report-pipeline9.ts', 'verify-drc-worker.ts']) copyFileSync(`${root}scripts/${name}`, `${runtime}/${name}`)
console.log(`Pipeline 9 runtime ready at ${manifest.router.commit}`)
