import { evaluateRelaxedDrc } from './lib/testing/evaluate-relaxed-drc'
import { migrateLegacyObstacleCircuitJsonMetadata } from './lib/testing/utils/migrate-legacy-obstacle-circuit-json-metadata'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
const root = process.argv[2]
const manifest = await Bun.file(resolve(root, 'manifest.json')).json()
for (const sample of manifest.samples) {
 const input = await Bun.file(resolve(root, sample.input)).json()
 const evidence = await Bun.file(resolve(root, sample.evidence)).json()
 const effectiveInput = migrateLegacyObstacleCircuitJsonMetadata(structuredClone(input))
 assert.deepEqual(effectiveInput, evidence.effectiveInputSrj, `${sample.id}: input migration changed`)
 const actual = evaluateRelaxedDrc({ inputSrj: effectiveInput, srjWithPointPairs: evidence.pointPairSrj, routedTraces: evidence.routedTraces })
 assert.deepEqual(actual.errors, evidence.errors, `${sample.id}: DRC evidence changed`)
 assert.deepEqual(Array.from(actual.circuitJson), evidence.circuitJson, `${sample.id}: conversion changed`)
 console.log(`${sample.id}: ${actual.errors.length} DRC errors reproduced`)
}
