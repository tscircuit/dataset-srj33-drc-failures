# dataset-srj33-drc-failures

12 distinct Simple Route JSON inputs with at least one DRC issue in the supplied
Pipeline 9 benchmark (150 issues total). The benchmark completed all 31 original
samples; 19 passed relaxed DRC and have been removed.

## Use

```sh
bun add https://github.com/tscircuit/dataset-srj33-drc-failures
```

```js
import samples, { sample001 } from "@tscircuit/dataset-srj33-drc-failures"
for (const [id, srj] of Object.entries(samples)) console.log(id, srj.bounds)
```

Original sample IDs are preserved, including gaps, to match the benchmark and
source issues. Enumerate exports rather than assuming consecutive sample numbers.
The package uses JavaScript exports and lightweight types, with no build step or
npm publication, following the [handbook](https://github.com/tscircuit/handbook/blob/main/guides/dataset-guidelines.md).

## Pipeline 9 selection

Source: [benchmark run 33978041068](https://github.com/tscircuit/tscircuit-autorouter/actions/runs/33978041068),
commit `84a1d769eb1877c34041fefae1ddc8642957696f`, Pipeline 9
`AutoroutingPipelineSolver9_PreloadedTraceGraph`, 1x effort, dataset `srj33`.
The user supplied this run's artifact. Its original JSON and run metadata are
preserved in `audit/pipeline9-benchmark-result.json` and
`audit/pipeline9-benchmark-run-metadata.json`; the manifest pins the result hash.

Selection is exactly `snapshot.drcErrorCount > 0`. All 31 samples completed;
12 failed relaxed DRC and 19 passed. The original dataset revision was
`c55b028f537c91c8f99f06ae10db26cc2d2aaac6`. No new routing run was used to
change these reported results.

| Sample | Source issue | Pipeline 9 DRC issues |
| --- | --- | ---: |
| [sample001](samples/sample001.json) | [#2310](https://github.com/tscircuit/tscircuit-autorouter/issues/2310) | 2 |
| [sample002](samples/sample002.json) | [#2147](https://github.com/tscircuit/tscircuit-autorouter/issues/2147) | 1 |
| [sample003](samples/sample003.json) | [#2111](https://github.com/tscircuit/tscircuit-autorouter/issues/2111) | 20 |
| [sample004](samples/sample004.json) | [#2058](https://github.com/tscircuit/tscircuit-autorouter/issues/2058) | 1 |
| [sample005](samples/sample005.json) | [#1770](https://github.com/tscircuit/tscircuit-autorouter/issues/1770) | 79 |
| [sample006](samples/sample006.json) | [#1753](https://github.com/tscircuit/tscircuit-autorouter/issues/1753) | 1 |
| [sample010](samples/sample010.json) | [#173](https://github.com/tscircuit/tscircuit-autorouter/issues/173) | 9 |
| [sample011](samples/sample011.json) | [#169](https://github.com/tscircuit/tscircuit-autorouter/issues/169) | 2 |
| [sample012](samples/sample012.json) | [#167](https://github.com/tscircuit/tscircuit-autorouter/issues/167) | 7 |
| [sample013](samples/sample013.json) | [#163](https://github.com/tscircuit/tscircuit-autorouter/issues/163) | 6 |
| [sample020](samples/sample020.json) | [#153](https://github.com/tscircuit/tscircuit-autorouter/issues/153) | 3 |
| [sample025](samples/sample025.json) | [#134](https://github.com/tscircuit/tscircuit-autorouter/issues/134) | 19 |

## Files and historical baseline

- `samples/`: original SRJ inputs for the 12 retained samples.
- `manifest.json`: source links, hashes, Pipeline 9 selection results, and original Pipeline 7 baseline metadata.
- `routed/` and `evidence/`: **historical Pipeline 7** routed outputs and exact DRC evidence for retained inputs. These are not Pipeline 9 outputs. The original `drcErrorCount` fields refer to Pipeline 7; use `pipeline9Benchmark.drcErrorCount` for the selection results.
- `audit/candidates.json`: discovery results for 96 extracted inputs; formerly included samples that now pass are marked `pipeline9-drc-passed`.
- `audit/issues-without-srj.json`: original discovery boundary across 191 open/closed issues. Collection inspected issue bodies, not comments or circuit-source reconstruction.

The historical baseline used capacity-autorouter 0.0.879 at commit
`450af9cb90d50880a96f62e9babafc79678031a1`, Pipeline 7, effort 1,
`evaluateRelaxedDrc`, checks 0.0.163, and 0.1 mm trace/via clearances.
Its source inputs were collected on 2026-09-05 UTC. Keeping this evidence preserves
the original provenance while filtering membership using the newer Pipeline 9 run.

## Validation

```sh
bun run validate            # Exports, hashes, and exact Pipeline 9 membership
bun run setup:runtime       # Install pinned historical Pipeline 7 runtime
bun run verify:drc          # Recompute retained Pipeline 7 baseline DRC evidence
bun run reproduce sample001 # Reproduce historical Pipeline 7 routing
```

`reproduce` without a sample runs all retained baseline inputs. These commands use
Bun 1.4.1 and the frozen historical dependency lock; they do not rerun Pipeline 9.
Run the autorouter benchmark with `--dataset srj33` to measure another revision.

## Provenance

Created through [tscircuit/create-repo#68](https://github.com/tscircuit/create-repo/pull/68).
Original scripts/documentation are MIT licensed. Submitted board data retains its
applicable upstream terms; source URLs are recorded per sample. Removed samples
remain available in Git history.
