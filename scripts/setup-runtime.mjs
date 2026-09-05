import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync, copyFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(readFileSync(`${root}manifest.json`))
const runtimes = [{ directory: 'autorouter', commit: manifest.router.commit, lock: 'runtime.bun.lock', worker: 'audit-report.ts' }]
if (manifest.additionalAudit) {
  runtimes.push({ directory: 'pipeline9', commit: manifest.additionalAudit.routerCommit, lock: 'pipeline9-runtime.bun.lock', worker: 'audit-report-pipeline9.ts' })
}
mkdirSync(`${root}.cache`, { recursive: true })
for (const config of runtimes) {
  const runtime = `${root}.cache/${config.directory}`
  if (!existsSync(`${runtime}/.git`)) execFileSync('git', ['clone', '--no-checkout', manifest.router.repository, runtime], { stdio: 'inherit' })
  execFileSync('git', ['checkout', '--detach', config.commit], { cwd: runtime, stdio: 'inherit' })
  copyFileSync(`${root}scripts/${config.lock}`, `${runtime}/bun.lock`)
  execFileSync('bun', ['install', '--frozen-lockfile'], { cwd: runtime, stdio: 'inherit' })
  for (const name of [config.worker, 'verify-drc-worker.ts']) copyFileSync(`${root}scripts/${name}`, `${runtime}/${name}`)
  console.log(`${config.directory} runtime ready at ${config.commit}`)
}
