import { AutoroutingPipelineSolver7_MultiGraph } from './lib/autorouter-pipelines/AutoroutingPipeline7_MultiGraph/AutoroutingPipelineSolver7_MultiGraph'
import { evaluateRelaxedDrc, combinePreloadedAndRoutedTraces } from './lib/testing/evaluate-relaxed-drc'
const [inputPath, outputPath] = process.argv.slice(2)
const input = await Bun.file(inputPath).json()
const start = performance.now()
let result: any
try {
 const solver = new AutoroutingPipelineSolver7_MultiGraph(structuredClone(input), { effort: 1 })
 solver.solve()
 result = { solved: solver.solved, failed: solver.failed, error: solver.error, iterations: solver.iterations }
 if (solver.solved && !solver.failed) {
  const traces = solver.getOutputSimplifiedPcbTraces()
  const pointPairs = solver.srjWithPointPairs
  if (!pointPairs) throw new Error('Solved without point-pair SRJ')
  const drc = evaluateRelaxedDrc({inputSrj: input, srjWithPointPairs: pointPairs, routedTraces: traces})
  result = {...result, traceCount: traces.length, drcErrorCount: drc.errors.length, errors: drc.errors,
   routedSrj: {...input, traces: combinePreloadedAndRoutedTraces(input.traces ?? [], traces)},
   pointPairSrj: pointPairs, routedTraces: traces }
 }
} catch (error) { result = { solved: false, failed: true, error: String(error), stack: (error as Error).stack } }
result.durationMs = performance.now()-start
await Bun.write(outputPath, JSON.stringify(result,null,2)+'\n')
console.log(JSON.stringify({inputPath, solved: result.solved, error: result.error, drcErrorCount: result.drcErrorCount, durationMs: result.durationMs}))
