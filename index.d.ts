/** Lightweight SRJ surface; extra source fields are preserved. Coordinates are mm. */
export interface SimpleRouteJson {
  layerCount: number
  minTraceWidth: number
  bounds: { minX: number; minY: number; maxX: number; maxY: number }
  obstacles: Array<Record<string, unknown>>
  connections: Array<{ name: string; pointsToConnect: Array<{ x: number; y: number; layer?: string; layers?: string[]; [key: string]: unknown }>; [key: string]: unknown }>
  traces?: Array<Record<string, unknown>>
  [key: string]: unknown
}
export declare const sample001: SimpleRouteJson
export declare const sample002: SimpleRouteJson
export declare const sample003: SimpleRouteJson
export declare const sample004: SimpleRouteJson
export declare const sample005: SimpleRouteJson
export declare const sample006: SimpleRouteJson
export declare const sample007: SimpleRouteJson
export declare const sample008: SimpleRouteJson
export declare const sample009: SimpleRouteJson
export declare const sample010: SimpleRouteJson
export declare const sample011: SimpleRouteJson
export declare const sample012: SimpleRouteJson
export declare const sample013: SimpleRouteJson
export declare const sample014: SimpleRouteJson
export declare const sample015: SimpleRouteJson
export declare const sample016: SimpleRouteJson
export declare const sample017: SimpleRouteJson
export declare const sample018: SimpleRouteJson
export declare const sample019: SimpleRouteJson
export declare const sample020: SimpleRouteJson
export declare const sample021: SimpleRouteJson
export declare const sample022: SimpleRouteJson
export declare const sample023: SimpleRouteJson
export declare const sample024: SimpleRouteJson
export declare const sample025: SimpleRouteJson
export declare const sample026: SimpleRouteJson
export declare const sample027: SimpleRouteJson
export declare const sample028: SimpleRouteJson
export declare const sample029: SimpleRouteJson
export declare const sample030: SimpleRouteJson
export declare const sample031: SimpleRouteJson
export declare const samples: Record<"sample001" | "sample002" | "sample003" | "sample004" | "sample005" | "sample006" | "sample007" | "sample008" | "sample009" | "sample010" | "sample011" | "sample012" | "sample013" | "sample014" | "sample015" | "sample016" | "sample017" | "sample018" | "sample019" | "sample020" | "sample021" | "sample022" | "sample023" | "sample024" | "sample025" | "sample026" | "sample027" | "sample028" | "sample029" | "sample030" | "sample031", SimpleRouteJson>
export default samples
