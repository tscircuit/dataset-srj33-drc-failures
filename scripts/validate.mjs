import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import samples from '../index.js'
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url))
const manifest = JSON.parse(read('manifest.json'))
const audit = JSON.parse(read('audit/candidates.json'))
assert.equal(manifest.sampleCount, 31)
assert.equal(Object.keys(samples).length, manifest.sampleCount)
assert.equal(audit.length, manifest.candidateCount)
assert.equal(audit.filter(c => c.status === 'included').length, manifest.sampleCount)
const hashes = new Set()
for (const [i, sample] of manifest.samples.entries()) {
  if (i) assert(manifest.samples[i-1].issueCreatedAt >= sample.issueCreatedAt)
  for (const kind of ['input', 'routed', 'evidence']) {
    const data = read(sample[kind])
    assert.equal(createHash('sha256').update(data).digest('hex'), sample[`${kind}Sha256`])
  }
  const source = audit.find(c => c.sampleId === sample.id)
  assert(source && source.status === 'included')
  assert.equal(source.issue, sample.issueNumber)
  assert.equal(source.url, sample.issueUrl)
  if (source.sourceUrl) assert.equal(source.sourceUrl, sample.sourceUrl)
  const input = samples[sample.id]
  assert.deepEqual(input, JSON.parse(read(sample.input)))
  assert(Array.isArray(input.connections) && input.connections.length > 0)
  assert(Array.isArray(input.obstacles))
  assert(Number.isInteger(input.layerCount) && input.layerCount > 0)
  for (const n of Object.values(input.bounds)) assert(Number.isFinite(n))
  const routed = JSON.parse(read(sample.routed))
  const evidence = JSON.parse(read(sample.evidence))
  assert(evidence.solved && !evidence.failed && !evidence.error)
  assert(evidence.traceCount > 0 && evidence.drcErrorCount > 0)
  assert.equal(evidence.traceCount, evidence.routedTraces.length)
  assert.equal(evidence.errors.length, sample.drcErrorCount)
  assert.equal(evidence.drcErrorCount, sample.drcErrorCount)
  const { traces: originalTraces, ...inputContext } = input
  const { traces, ...routedContext } = routed
  assert.deepEqual(routedContext, inputContext)
  const replacements = new Set(evidence.routedTraces.map(t => t.__replaces_pcb_trace_id).filter(Boolean))
  assert.deepEqual(traces, [...(originalTraces ?? []).filter(t => !replacements.has(t.pcb_trace_id)), ...evidence.routedTraces])
  if (sample.duplicateOf) {
    const original = manifest.samples.find(s => s.id === sample.duplicateOf)
    assert(original && original.id < sample.id)
    assert.equal(original.inputSha256, sample.inputSha256)
  } else assert(!hashes.has(sample.inputSha256))
  hashes.add(sample.inputSha256)
}
assert.equal(hashes.size, manifest.uniqueInputCount)
assert.equal(readdirSync(new URL('../samples', import.meta.url)).length, manifest.sampleCount)
console.log(`Validated ${manifest.sampleCount} reports, ${hashes.size} unique SRJs, ${manifest.samples.reduce((sum,s) => sum+s.drcErrorCount,0)} DRC errors.`)
