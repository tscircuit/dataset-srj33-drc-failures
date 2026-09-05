import { execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(readFileSync(`${root}manifest.json`))
const requested = process.argv[2]
const selected = manifest.samples.filter(s => !requested || s.id === requested)
assert(selected.length, `Unknown sample: ${requested}`)
mkdirSync(`${root}.cache/reproduced`, { recursive: true })
for (const sample of selected) {
 const output = `${root}.cache/reproduced/${sample.id}.json`
 execFileSync('bun', [`${root}.cache/autorouter/audit-report-pipeline9.ts`, `${root}${sample.input}`, output], { timeout: manifest.router.timeoutSeconds * 1000, stdio: 'inherit' })
 const actual = JSON.parse(readFileSync(output))
 const expected = JSON.parse(readFileSync(`${root}${sample.evidence}`))
 assert(actual.solved && !actual.failed, `${sample.id}: routing did not complete`)
 assert.deepEqual(actual.errors, expected.errors, `${sample.id}: DRC errors changed`)
 assert.deepEqual(actual.routedTraces, expected.routedTraces, `${sample.id}: routing changed`)
 console.log(`${sample.id}: routing and DRC evidence reproduced`)
}
