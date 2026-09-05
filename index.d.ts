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
export declare const sample010: SimpleRouteJson
export declare const sample011: SimpleRouteJson
export declare const sample012: SimpleRouteJson
export declare const sample013: SimpleRouteJson
export declare const sample020: SimpleRouteJson
export declare const sample025: SimpleRouteJson
export declare const samples: Record<"sample001" | "sample002" | "sample003" | "sample004" | "sample005" | "sample006" | "sample010" | "sample011" | "sample012" | "sample013" | "sample020" | "sample025", SimpleRouteJson>
export default samples
