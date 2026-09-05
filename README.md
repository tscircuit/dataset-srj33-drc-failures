# dataset-srj33-drc-failures

31 recent bug reports from [tscircuit/tscircuit-autorouter](https://github.com/tscircuit/tscircuit-autorouter) whose SRJs complete Pipeline 7 routing but fail the autorouter benchmark DRC. Includes **28 distinct input SRJs** and **770 recorded DRC errors**.

## Use

```sh
bun add https://github.com/tscircuit/dataset-srj33-drc-failures
```

```js
import samples, { sample001 } from "@tscircuit/dataset-srj33-drc-failures"
// sample001 is the original, unmodified Simple Route JSON input.
console.log(sample001.connections.length)
for (const [id, srj] of Object.entries(samples)) console.log(id, srj.bounds)
```

The package follows the [handbook dataset guidelines](https://github.com/tscircuit/handbook/blob/main/guides/dataset-guidelines.md): `index.js`, lightweight `index.d.ts`, JSON files, no transpilation, no npm publication. Node.js 22+ or Bun supports its JSON import attributes.

## Files

- `samples/sampleNNN.json`: original SRJ input, preserving every field (JSON whitespace normalized).
- `routed/sampleNNN.json`: the original SRJ context with preloaded and newly routed traces combined using upstream replacement semantics. These outputs intentionally contain DRC failures.
- `evidence/sampleNNN.json`: solver completion flags, transformed point-pair SRJ, newly routed traces, and exact DRC error objects.
- `manifest.json`: issue/source links, source dates, file hashes, duplicate annotations, error counts, and pinned runtime details.
- `audit/candidates.json`: results for all 96 extracted inputs, including the 61 that pass DRC, 2 that fail routing, and 2 unrelated files from a shared gist.
- `audit/issues-without-srj.json`: issues without an extracted SRJ in their body, retained to show the discovery boundary.

## Selection and limits

Collected all 191 open and closed issues returned by GitHub on 2026-09-05 UTC. Extracted 96 SRJs from bug-report API links, JSON attachments, and gist JSON files linked in issue bodies. Sorted by **issue creation date**, newest first; included every qualifying report (31, within the requested 30–50 range). The qualifying dates span 2025-05-14 through 2026-08-30. Comments and SRJs requiring reconstruction from circuit source/Circuit JSON are outside this collection. An issue's original failure need not still reproduce: the criterion is the measured behavior of the pinned router.

A sample qualifies only when `solved === true`, `failed === false`, at least one new trace is returned, and at least one DRC error is recorded. This is solver completion, not a claim of electrically complete or manufacturing-ready routing. Failed routing is excluded. Each candidate had a 180-second wall-time limit at effort 1; none timed out.

Separate reports with identical SRJs are retained. `duplicateOf` identifies the first identical input by SHA-256. Use the 28 entries with `duplicateOf === null` for a deduplicated benchmark; do not put duplicates in different train/test splits. Two issues link the same multi-board gist; each is matched only to the reproduction filename explicitly named in its issue body.

## Router and DRC

- Router: `@tscircuit/capacity-autorouter` 0.0.879, `AutoroutingPipelineSolver7_MultiGraph`, effort 1.
- Source commit: [`450af9cb90d50880a96f62e9babafc79678031a1`](https://github.com/tscircuit/tscircuit-autorouter/tree/450af9cb90d50880a96f62e9babafc79678031a1).
- DRC: upstream `evaluateRelaxedDrc`, `@tscircuit/checks` 0.0.163; trace clearance 0.1 mm and via clearance 0.1 mm, with default continuity and typed clearance checks enabled.
- Checks cover trace overlap/clearance, board bounds, trace continuity, pad–trace and via–trace clearance, and same/different-net via spacing. This is the upstream **relaxed benchmark DRC**, not every fabrication rule or `runAllChecks`.
- DRC conversion uses original input context, original connections, transformed point-pair connections, and preloaded plus newly routed copper. The point-pair evidence is saved because evaluating the exported routed SRJ with a different conversion pipeline may give different results.
- Bun 1.4.1; exact runtime dependencies are frozen in `scripts/runtime.bun.lock`.

## Validate and reproduce

```sh
bun run validate            # No dependencies: hashes, exports, provenance counts, geometry context
bun run setup:runtime       # Clone pinned autorouter and install its frozen dependencies
bun run verify:drc          # Recompute every stored DRC error from saved routing evidence
bun run reproduce sample001 # Reroute one original input; compare exact traces and errors
bun run reproduce           # Reroute all 31 inputs, sequentially
```

Runtime checkout and fresh results live in ignored `.cache/`. The dataset itself needs no install/build step. Reproduction uses the pinned upstream solver without patching it or turning off repair stages. The locked runtime is intentionally separate from the dependency-free dataset package.

## Reports

| Sample | Issue | DRC errors | Duplicate of |
| --- | --- | ---: | --- |
| [sample001](samples/sample001.json) | [#2310](https://github.com/tscircuit/tscircuit-autorouter/issues/2310) | 3 | — |
| [sample002](samples/sample002.json) | [#2147](https://github.com/tscircuit/tscircuit-autorouter/issues/2147) | 9 | — |
| [sample003](samples/sample003.json) | [#2111](https://github.com/tscircuit/tscircuit-autorouter/issues/2111) | 19 | — |
| [sample004](samples/sample004.json) | [#2058](https://github.com/tscircuit/tscircuit-autorouter/issues/2058) | 1 | — |
| [sample005](samples/sample005.json) | [#1770](https://github.com/tscircuit/tscircuit-autorouter/issues/1770) | 94 | — |
| [sample006](samples/sample006.json) | [#1753](https://github.com/tscircuit/tscircuit-autorouter/issues/1753) | 1 | — |
| [sample007](samples/sample007.json) | [#721](https://github.com/tscircuit/tscircuit-autorouter/issues/721) | 1 | — |
| [sample008](samples/sample008.json) | [#720](https://github.com/tscircuit/tscircuit-autorouter/issues/720) | 1 | sample007 |
| [sample009](samples/sample009.json) | [#178](https://github.com/tscircuit/tscircuit-autorouter/issues/178) | 56 | — |
| [sample010](samples/sample010.json) | [#173](https://github.com/tscircuit/tscircuit-autorouter/issues/173) | 23 | — |
| [sample011](samples/sample011.json) | [#169](https://github.com/tscircuit/tscircuit-autorouter/issues/169) | 2 | — |
| [sample012](samples/sample012.json) | [#167](https://github.com/tscircuit/tscircuit-autorouter/issues/167) | 2 | — |
| [sample013](samples/sample013.json) | [#163](https://github.com/tscircuit/tscircuit-autorouter/issues/163) | 2 | — |
| [sample014](samples/sample014.json) | [#162](https://github.com/tscircuit/tscircuit-autorouter/issues/162) | 10 | — |
| [sample015](samples/sample015.json) | [#160](https://github.com/tscircuit/tscircuit-autorouter/issues/160) | 26 | — |
| [sample016](samples/sample016.json) | [#159](https://github.com/tscircuit/tscircuit-autorouter/issues/159) | 26 | sample015 |
| [sample017](samples/sample017.json) | [#158](https://github.com/tscircuit/tscircuit-autorouter/issues/158) | 12 | — |
| [sample018](samples/sample018.json) | [#157](https://github.com/tscircuit/tscircuit-autorouter/issues/157) | 4 | — |
| [sample019](samples/sample019.json) | [#155](https://github.com/tscircuit/tscircuit-autorouter/issues/155) | 6 | — |
| [sample020](samples/sample020.json) | [#153](https://github.com/tscircuit/tscircuit-autorouter/issues/153) | 24 | — |
| [sample021](samples/sample021.json) | [#151](https://github.com/tscircuit/tscircuit-autorouter/issues/151) | 12 | — |
| [sample022](samples/sample022.json) | [#142](https://github.com/tscircuit/tscircuit-autorouter/issues/142) | 100 | — |
| [sample023](samples/sample023.json) | [#141](https://github.com/tscircuit/tscircuit-autorouter/issues/141) | 22 | — |
| [sample024](samples/sample024.json) | [#135](https://github.com/tscircuit/tscircuit-autorouter/issues/135) | 6 | sample019 |
| [sample025](samples/sample025.json) | [#134](https://github.com/tscircuit/tscircuit-autorouter/issues/134) | 24 | — |
| [sample026](samples/sample026.json) | [#133](https://github.com/tscircuit/tscircuit-autorouter/issues/133) | 102 | — |
| [sample027](samples/sample027.json) | [#132](https://github.com/tscircuit/tscircuit-autorouter/issues/132) | 6 | — |
| [sample028](samples/sample028.json) | [#131](https://github.com/tscircuit/tscircuit-autorouter/issues/131) | 56 | — |
| [sample029](samples/sample029.json) | [#130](https://github.com/tscircuit/tscircuit-autorouter/issues/130) | 16 | — |
| [sample030](samples/sample030.json) | [#129](https://github.com/tscircuit/tscircuit-autorouter/issues/129) | 98 | — |
| [sample031](samples/sample031.json) | [#124](https://github.com/tscircuit/tscircuit-autorouter/issues/124) | 6 | — |

## Provenance

Created through [tscircuit/create-repo#68](https://github.com/tscircuit/create-repo/pull/68). Inputs are extracted from publicly linked upstream bug reports and retain their applicable source terms; source URLs are recorded per sample. Original scripts/documentation are MIT licensed. This repository does not relicense submitted board designs or include reporter account metadata.
