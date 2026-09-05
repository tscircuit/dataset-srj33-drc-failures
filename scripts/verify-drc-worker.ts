import { evaluateRelaxedDrc } from './lib/testing/evaluate-relaxed-drc'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
const root = process.argv[2]
const manifest = await Bun.file(resolve(root, 'manifest.json')).json()
for (const sample of manifest.samples) {
 const input = await Bun.file(resolve(root, sample.input)).json()
 const evidence = await Bun.file(resolve(root, sample.evidence)).json()
 const actual = evaluateRelaxedDrc({ inputSrj: input, srjWithPointPairs: evidence.pointPairSrj, routedTraces: evidence.routedTraces })
 assert.deepEqual(actual.errors, evidence.errors, `${sample.id}: DRC evidence changed`)
 console.log(`${sample.id}: ${actual.errors.length} DRC errors reproduced`)
}
