# dataset-srj33-drc-failures

15 distinct SRJs that complete Pipeline 9 routing and retain independently confirmed
relaxed DRC violations (324 reported errors). All saved routed outputs and evidence
use the same corrected converter and pinned Pipeline 9 runtime.

```sh
bun add https://github.com/tscircuit/dataset-srj33-drc-failures
```

```js
import samples from "@tscircuit/dataset-srj33-drc-failures"
for (const [id, srj] of Object.entries(samples)) console.log(id, srj.bounds)
```

Sample IDs are preserved and sparse. Enumerate exports instead of assuming a
continuous numeric range. This repository follows the
[dataset handbook](https://github.com/tscircuit/handbook/blob/main/guides/dataset-guidelines.md)
with JavaScript exports, lightweight types, and no package build or npm publication.

## Revalidation and selection

The [Blacksmith audit](https://github.com/tscircuit/tscircuit-autorouter/actions/runs/33986579884) rerouted all 37 previous inputs using
`AutoroutingPipelineSolver9_PreloadedTraceGraph`, effort 1, Bun 1.4.1 on ARM64,
and router commit `934cfed20151661b6ce1aa00827b1fc1e69ce28c`.
The per-input limit was 30 minutes, with eight concurrent workers.

The converter now preserves legacy pad metadata and split pad geometry, respects
explicit pad ownership, retains pre-existing trace connectivity, and preserves
legacy oval shapes. Logical connectivity comes from requested terminals and
original identities, so an incorrectly routed endpoint cannot merge two nets.

The second check uses Shapely 2.1.2 independently of the autorouter's converter and
DRC implementation. For each reported error it reconstructs copper from the original
SRJ and raw routed traces, verifies a common layer and declared net identities,
and measures the clearance. It uses the smaller endpoint wire width and inscribed
copper for legacy multi-layer rectangular obstacles with uncertain provenance.
A violation must exceed numerical uncertainty by at least 0.0000001 mm.
Same-net via spacing is checked as a separate physical spacing rule.

**Every reported error in every retained sample must have a confirmed witness.**
Samples with incomplete terminal evidence, ambiguous geometry, or unresolved
identity mappings are excluded even if other errors appear valid. The checks use
the benchmark's relaxed 0.1 mm trace/pad/via clearance rules on the supplied SRJ;
they do not establish validity of fabrication rules absent from that input.

Results: 16 drc-passed, 15 retained, 6 unconfirmed-errors.

- DRC passes removed: sample001, sample011, sample012, sample013, sample033, sample034, sample035, sample036, sample037, sample038, sample039, sample040, sample041, sample042, sample043, sample047.
- Unconfirmed cases excluded: sample004, sample010, sample020, sample025, sample032, sample052.
- `sample011` now passes after the pad-conversion corrections.

## Evidence

- `samples/`: original SRJ inputs, unchanged.
- `routed/`: input context with preloaded and newly routed copper combined.
- `evidence/`: solver status, effective input, point-pair SRJ, raw routed traces, converted Circuit JSON, and exact DRC errors.
- `audit/independent-geometry.json`: per-error object IDs, net comparison, shared layer, segment indices, and independently measured clearance.
- `audit/authenticity-selection.json`: all 37 inclusion/exclusion decisions.
- `audit/authenticity-results.json.gz`: self-contained inputs and complete results for all 37 cases, including removed cases; SHA-256 pinned in the manifest.

The manifest records the source report, file hashes, environment, and audit run.
Earlier collection/filtering evidence remains under `audit/`; it is historical.
The previous 37-sample dataset remains at `f566b62be0f83395d9ab63ddc068f9d645b68b16`.
All currently retained evidence is Pipeline 9, replacing the older mixed baselines.

## Verify and reproduce

```sh
bun run validate
bun run setup:runtime
bun run verify:drc
python3 -m pip install -r scripts/requirements-verification.txt
python3 scripts/verify-geometry.py
bun run reproduce sample002
```

Use Bun 1.4.1 on ARM64 for exact DRC evidence reproduction. Other architectures may
differ in the final floating-point digit. The frozen runtime dependency lock is
included. `reproduce` without an ID reroutes every retained sample and compares
exact traces and errors; runtime checkouts stay in ignored `.cache/`.
The geometry verifier checks the archived results independently and verifies that
the published membership contains exactly the cases whose errors all pass.

## Samples

| Sample | Source | Confirmed DRC errors |
| --- | --- | ---: |
| [sample002](samples/sample002.json) | [#2147](https://github.com/tscircuit/tscircuit-autorouter/issues/2147) | 5 |
| [sample003](samples/sample003.json) | [#2111](https://github.com/tscircuit/tscircuit-autorouter/issues/2111) | 20 |
| [sample005](samples/sample005.json) | [#1770](https://github.com/tscircuit/tscircuit-autorouter/issues/1770) | 79 |
| [sample006](samples/sample006.json) | [#1753](https://github.com/tscircuit/tscircuit-autorouter/issues/1753) | 1 |
| [sample044](samples/sample044.json) | [bugreport104-pedometer-v1.0.6.unrouted.srj.json](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport104-pedometer-v1.0.6.unrouted.srj.json) | 26 |
| [sample045](samples/sample045.json) | [<board#111 />](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport11-b2de3c/bugreport11-b2de3c.json) | 60 |
| [sample046](samples/sample046.json) | [bugreport23-LGA15x4](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport23-LGA15x4/bugreport23-LGA15x4.srj.json) | 19 |
| [sample048](samples/sample048.json) | [<board#112 />](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport64-be7d8f/bugreport64-be7d8f.json) | 17 |
| [sample049](samples/sample049.json) | [<board#726 />](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport67-a0cb81/bugreport67-a0cb81.json) | 6 |
| [sample050](samples/sample050.json) | [<board#17141 />](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport68-41562e/bugreport68-41562e.json) | 8 |
| [sample051](samples/sample051.json) | [bugreport68-solar-battery-charger](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport68-solar-battery-charger/bugreport68-solar-battery-charger.srj.json) | 2 |
| [sample053](samples/sample053.json) | [F1C100S laptop motherboard: autorouter stalls at 0% in highDensityRouteSolver and times out after 600s](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport81-6b40e7/bugreport81-6b40e7.json) | 42 |
| [sample054](samples/sample054.json) | [<board#31410 name=".CORNE_CHOCOLATE_V4_1_LEFT" />](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport94-56fa2e/bugreport94-56fa2e.json) | 5 |
| [sample055](samples/sample055.json) | [bugreport96-full-gameboy-no-breakout](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport96-full-gameboy-no-breakout/bugreport96-full-gameboy-no-breakout.srj.json) | 31 |
| [sample056](samples/sample056.json) | [bugreport99-nrf52810-drc-identity-swap](https://github.com/tscircuit/tscircuit-autorouter/blob/84a1d769eb1877c34041fefae1ddc8642957696f/fixtures/bug-reports/bugreport99-nrf52810-drc-identity-swap/bugreport99-nrf52810-drc-identity-swap.srj.json) | 3 |

## Provenance

Created through [tscircuit/create-repo#68](https://github.com/tscircuit/create-repo/pull/68).
Original repository scripts and documentation are MIT licensed. Board inputs retain
their applicable upstream terms; their source URLs and original hashes are preserved.
