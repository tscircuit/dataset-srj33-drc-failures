# dataset-srj33-drc-failures

37 distinct Simple Route JSON inputs with at least one measured Pipeline 9 DRC
issue (451 issues across the recorded results). Includes the 12 retained original
samples and 25 additional bug-report inputs verified on Blacksmith.

## Use

```sh
bun add https://github.com/tscircuit/dataset-srj33-drc-failures
```

```js
import samples, { sample001 } from "@tscircuit/dataset-srj33-drc-failures"
for (const [id, srj] of Object.entries(samples)) console.log(id, srj.bounds)
```

Original sample IDs are preserved: 001–006, 010–013, 020, and 025. Additions use
032–056; IDs of removed samples are not reused. Enumerate exports rather
than assuming consecutive sample numbers. The package uses JavaScript exports
and lightweight types, with no build step or npm publication, following the
[handbook](https://github.com/tscircuit/handbook/blob/main/guides/dataset-guidelines.md).

## Pipeline 9 selection

All measurements use `AutoroutingPipelineSolver9_PreloadedTraceGraph`
with effort 1 and the upstream `evaluateRelaxedDrc` evaluator. The original-input loader's legacy
obstacle-metadata migration is also applied to additional candidates.
These are relaxed benchmark checks, not every fabrication rule.

### Original retained samples

The [supplied benchmark run 33978041068](https://github.com/tscircuit/tscircuit-autorouter/actions/runs/33978041068)
completed all 31 original inputs. Twelve had `drcErrorCount > 0` (150 issues),
and the 19 DRC-passing samples were removed. Original JSON and run metadata are
preserved under `audit/pipeline9-benchmark-*`; the manifest pins the result hash.
The unfiltered dataset remains at commit `c55b028f537c91c8f99f06ae10db26cc2d2aaac6`.

### Additional bug-report audit

[Blacksmith run 33980539076](https://github.com/tscircuit/tscircuit-autorouter/actions/runs/33980539076)
rechecked 25 qualifying inputs at router revision
`0f18c99a09d19d8e690bb1767eef0c86ba80473e` after a DRC fix merged during discovery. It ran with eight concurrent workers and a
20-minute wall-clock limit per candidate. The
[initial discovery run](https://github.com/tscircuit/tscircuit-autorouter/actions/runs/33978900493) screened
136 candidates at `84a1d769eb1877c34041fefae1ddc8642957696f`
and found 25 provisional failures. Discovery outcomes:
97 DRC passes, 25 qualifying failures, 2 errors, 11 routing failures, and 1 timeout. Inputs came from issue-linked SRJs
excluded by the earlier Pipeline 7 scan and from the repository's
`fixtures/bug-reports` directory at the discovery revision. Issue comments
were also searched but provided no additional SRJ URLs. Exact JSON-equivalent
inputs were deduplicated against all 31 original samples and within the batch.

Selection requires `solved === true`, `failed === false`, at least one newly
routed trace, and `drcErrorCount > 0`. The audit added 25 inputs with
301 Pipeline 9 issues. All 25 candidates qualified again.
Failed, timed-out, and DRC-passing candidates are not included. A timeout is an
unevaluated result, not evidence that an input is unroutable or DRC-clean.

The audit runner and inputs are preserved at
[`58c8380d6065`](https://github.com/tscircuit/tscircuit-autorouter/tree/58c8380d6065a46ba573f937b9a283bdc01d22d6/candidate-audit).
`audit/additional-candidates.json` records every outcome and original source;
`audit/additional-run-metadata.json` pins the environment and workflow run.
`audit/discovery-summary.json` and `audit/discovery-run-metadata.json` retain
the first-pass results. `audit/additional-excluded-duplicates.json` records inputs removed before routing.
The audit branch contains only the collection/measurement harness; solver code
is unchanged from the pinned revision.

## Files and evidence

- `samples/`: unmodified source SRJ inputs (JSON whitespace normalized).
- `manifest.json`: source links, file hashes, Pipeline 9 results, and per-sample baseline pipeline.
- `routed/`: input context with the measured routed traces combined with preloaded copper.
- `evidence/`: solver flags, transformed point-pair SRJ, new traces, and exact DRC error objects. Additional samples also include the effective migrated input.
- `audit/`: source discovery, filtering, and benchmark records, including excluded inputs.

The original 12 samples retain **historical Pipeline 7** output/evidence, indicated
by `baselinePipeline: 7`. Their Pipeline 9 selection results are in
`pipeline9Benchmark`; the older `drcErrorCount` fields describe the Pipeline 7 baseline.
Additional samples use `baselinePipeline: 9` and store actual Pipeline 9 outputs
and errors from the new audit. For those samples both error counts agree.

The historical Pipeline 7 baseline uses source commit
`450af9cb90d50880a96f62e9babafc79678031a1`, effort 1, and its frozen dependency lock.
Each runtime has its own locked dependencies. DRC evidence is converted with
original connections, transformed point pairs, and combined preloaded/new copper;
other conversion pipelines may produce different results.

## Validate and reproduce

```sh
bun run validate             # Membership, source/result hashes, exports, geometry context
bun run setup:runtime        # Install both pinned runtimes and frozen dependencies
bun run verify:drc           # Recompute every stored error using its baseline pipeline
bun run reproduce sample032  # Reroute an additional input with pinned Pipeline 9
```

`reproduce` without a sample runs all retained inputs with their recorded baseline
pipeline. Runtime checkouts and new results stay in ignored `.cache/`.
Use Bun 1.4.1 on ARM64, matching the recorded audit and CI architecture.
Reproduction compares exact routed traces and DRC error objects; x64 can differ
in the final floating-point digit of error coordinates.
Run the autorouter benchmark with `--dataset srj33` to evaluate a newer revision.

## Samples

| Sample | Source | Pipeline 9 issues | Stored baseline |
| --- | --- | ---: | --- |
| [sample001](samples/sample001.json) | [#2310](https://github.com/tscircuit/tscircuit-autorouter/issues/2310) | 2 | Pipeline 7 |
| [sample002](samples/sample002.json) | [#2147](https://github.com/tscircuit/tscircuit-autorouter/issues/2147) | 1 | Pipeline 7 |
| [sample003](samples/sample003.json) | [#2111](https://github.com/tscircuit/tscircuit-autorouter/issues/2111) | 20 | Pipeline 7 |
| [sample004](samples/sample004.json) | [#2058](https://github.com/tscircuit/tscircuit-autorouter/issues/2058) | 1 | Pipeline 7 |
| [sample005](samples/sample005.json) | [#1770](https://github.com/tscircuit/tscircuit-autorouter/issues/1770) | 79 | Pipeline 7 |
| [sample006](samples/sample006.json) | [#1753](https://github.com/tscircuit/tscircuit-autorouter/issues/1753) | 1 | Pipeline 7 |
| [sample010](samples/sample010.json) | [#173](https://github.com/tscircuit/tscircuit-autorouter/issues/173) | 9 | Pipeline 7 |
| [sample011](samples/sample011.json) | [#169](https://github.com/tscircuit/tscircuit-autorouter/issues/169) | 2 | Pipeline 7 |
| [sample012](samples/sample012.json) | [#167](https://github.com/tscircuit/tscircuit-autorouter/issues/167) | 7 | Pipeline 7 |
| [sample013](samples/sample013.json) | [#163](https://github.com/tscircuit/tscircuit-autorouter/issues/163) | 6 | Pipeline 7 |
| [sample020](samples/sample020.json) | [#153](https://github.com/tscircuit/tscircuit-autorouter/issues/153) | 3 | Pipeline 7 |
| [sample025](samples/sample025.json) | [#134](https://github.com/tscircuit/tscircuit-autorouter/issues/134) | 19 | Pipeline 7 |
| [sample032](samples/sample032.json) | [#1721](https://github.com/tscircuit/tscircuit-autorouter/issues/1721) | 8 | Pipeline 9 |
| [sample033](samples/sample033.json) | [#250](https://github.com/tscircuit/tscircuit-autorouter/issues/250) | 27 | Pipeline 9 |
| [sample034](samples/sample034.json) | [#233](https://github.com/tscircuit/tscircuit-autorouter/issues/233) | 4 | Pipeline 9 |
| [sample035](samples/sample035.json) | [#228](https://github.com/tscircuit/tscircuit-autorouter/issues/228) | 5 | Pipeline 9 |
| [sample036](samples/sample036.json) | [#222](https://github.com/tscircuit/tscircuit-autorouter/issues/222) | 3 | Pipeline 9 |
| [sample037](samples/sample037.json) | [#205](https://github.com/tscircuit/tscircuit-autorouter/issues/205) | 3 | Pipeline 9 |
| [sample038](samples/sample038.json) | [#200](https://github.com/tscircuit/tscircuit-autorouter/issues/200) | 1 | Pipeline 9 |
| [sample039](samples/sample039.json) | [#198](https://github.com/tscircuit/tscircuit-autorouter/issues/198) | 1 | Pipeline 9 |
| [sample040](samples/sample040.json) | [#195](https://github.com/tscircuit/tscircuit-autorouter/issues/195) | 7 | Pipeline 9 |
| [sample041](samples/sample041.json) | [#187](https://github.com/tscircuit/tscircuit-autorouter/issues/187) | 2 | Pipeline 9 |
| [sample042](samples/sample042.json) | [#184](https://github.com/tscircuit/tscircuit-autorouter/issues/184) | 7 | Pipeline 9 |
| [sample043](samples/sample043.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport03-fe4a17/bugreport03-fe4a17.json) | 1 | Pipeline 9 |
| [sample044](samples/sample044.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport104-pedometer-v1.0.6.unrouted.srj.json) | 26 | Pipeline 9 |
| [sample045](samples/sample045.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport11-b2de3c/bugreport11-b2de3c.json) | 60 | Pipeline 9 |
| [sample046](samples/sample046.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport23-LGA15x4/bugreport23-LGA15x4.srj.json) | 23 | Pipeline 9 |
| [sample047](samples/sample047.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport45-issue628/bugreport45-issue628.json) | 1 | Pipeline 9 |
| [sample048](samples/sample048.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport64-be7d8f/bugreport64-be7d8f.json) | 17 | Pipeline 9 |
| [sample049](samples/sample049.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport67-a0cb81/bugreport67-a0cb81.json) | 6 | Pipeline 9 |
| [sample050](samples/sample050.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport68-41562e/bugreport68-41562e.json) | 8 | Pipeline 9 |
| [sample051](samples/sample051.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport68-solar-battery-charger/bugreport68-solar-battery-charger.srj.json) | 2 | Pipeline 9 |
| [sample052](samples/sample052.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport73-qfp16/bugreport73-qfp16.srj.json) | 4 | Pipeline 9 |
| [sample053](samples/sample053.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport81-6b40e7/bugreport81-6b40e7.json) | 42 | Pipeline 9 |
| [sample054](samples/sample054.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport94-56fa2e/bugreport94-56fa2e.json) | 5 | Pipeline 9 |
| [sample055](samples/sample055.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport96-full-gameboy-no-breakout/bugreport96-full-gameboy-no-breakout.srj.json) | 35 | Pipeline 9 |
| [sample056](samples/sample056.json) | [bug-report fixture](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport99-nrf52810-drc-identity-swap/bugreport99-nrf52810-drc-identity-swap.srj.json) | 3 | Pipeline 9 |

## Provenance

Created through [tscircuit/create-repo#68](https://github.com/tscircuit/create-repo/pull/68).
Original scripts/documentation are MIT licensed. Submitted board data retains its
applicable upstream terms; immutable repository sources or public bug-report URLs
are recorded per sample. The original discovery scan covered 191 open/closed issues
and 96 extracted SRJs. Removed samples remain available in Git history.
