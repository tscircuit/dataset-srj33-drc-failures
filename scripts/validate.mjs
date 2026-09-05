import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
import samples from '../index.js'
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url))
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex')
const manifest = JSON.parse(read('manifest.json'))
const audit = manifest.authenticityAudit
assert.equal(manifest.schemaVersion, 2)
for (const [file, hash] of [[audit.resultArchive, audit.resultArchiveSha256], [audit.selectionFile, audit.selectionSha256], [audit.geometryFile, audit.geometrySha256], ['scripts/runtime.bun.lock', audit.runtimeLockSha256]]) assert.equal(sha(read(file)), hash)
const archive = JSON.parse(gunzipSync(read(audit.resultArchive)))
const selection = JSON.parse(read(audit.selectionFile))
const proof = JSON.parse(read(audit.geometryFile))
assert.equal(archive.samples.length, audit.candidateCount)
assert.deepEqual(selection.map(s => s.id), archive.samples.map(s => s.source.id))
assert.deepEqual(proof.map(s => s.id), selection.map(s => s.id))
const confirmed = selection.filter(s => s.status === 'retained').map(s => s.id)
assert.deepEqual(Object.keys(samples), confirmed)
assert.deepEqual(manifest.samples.map(s => s.id), confirmed)
assert.equal(manifest.sampleCount, confirmed.length)
assert.equal(manifest.uniqueInputCount, confirmed.length)
assert.equal(manifest.router.commit, archive.runMetadata.routerCommit)
let errors = 0
const inputs = new Set()
for (const sample of manifest.samples) {
  for (const kind of ['input', 'routed', 'evidence']) assert.equal(sha(read(sample[kind])), sample[`${kind}Sha256`])
  const original = archive.samples.find(s => s.source.id === sample.id)
  assert.equal(sample.inputSha256, original.source.inputSha256)
  assert.equal(sample.sourceUrl, original.source.sourceUrl)
  assert.deepEqual(samples[sample.id], original.inputSrj)
  const evidence = JSON.parse(read(sample.evidence))
  const actualProof = proof.find(s => s.id === sample.id)
  assert(evidence.solved && !evidence.failed && !evidence.error && evidence.traceCount > 0)
  assert.equal(sample.baselinePipeline, 9)
  assert(evidence.errors.length > 0)
  assert.equal(evidence.traceCount, evidence.routedTraces.length)
  assert.deepEqual(evidence.errors, original.result.errors)
  assert.equal(evidence.errors.length, evidence.drcErrorCount)
  assert.equal(sample.drcErrorCount, evidence.drcErrorCount)
  assert.equal(sample.pipeline9Benchmark.drcErrorCount, evidence.drcErrorCount)
  assert.equal(actualProof.errors.length, evidence.errors.length)
  assert(actualProof.errors.every(p => p.status === 'confirmed'))
  assert.deepEqual(actualProof.errors.map(p => p.error), evidence.errors)
  assert.deepEqual(JSON.parse(read(sample.routed)), original.result.routedSrj)
  assert.deepEqual(evidence.routedTraces, original.result.routedTraces)
  const { traces: oldTraces, ...context } = original.inputSrj
  const { traces, ...routedContext } = original.result.routedSrj
  assert.deepEqual(context, routedContext)
  const replacements = new Set(evidence.routedTraces.map(t => t.__replaces_pcb_trace_id).filter(Boolean))
  assert.deepEqual(traces, [...(oldTraces ?? []).filter(t => !replacements.has(t.pcb_trace_id)), ...evidence.routedTraces])
  assert(!inputs.has(sample.inputSha256))
  inputs.add(sample.inputSha256)
  errors += evidence.drcErrorCount
}
assert.equal(errors, audit.verifiedErrorCount)
for (const folder of ['samples', 'routed', 'evidence']) assert.equal(readdirSync(new URL(`../${folder}`, import.meta.url)).length, confirmed.length)
console.log(`Validated ${confirmed.length} distinct Pipeline 9 failures with ${errors} independently confirmed DRC errors.`)
