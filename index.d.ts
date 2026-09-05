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
export declare const sample002: SimpleRouteJson
export declare const sample003: SimpleRouteJson
export declare const sample005: SimpleRouteJson
export declare const sample006: SimpleRouteJson
export declare const sample044: SimpleRouteJson
export declare const sample045: SimpleRouteJson
export declare const sample046: SimpleRouteJson
export declare const sample048: SimpleRouteJson
export declare const sample049: SimpleRouteJson
export declare const sample050: SimpleRouteJson
export declare const sample051: SimpleRouteJson
export declare const sample053: SimpleRouteJson
export declare const sample054: SimpleRouteJson
export declare const sample055: SimpleRouteJson
export declare const sample056: SimpleRouteJson
export declare const samples: Record<"sample002" | "sample003" | "sample005" | "sample006" | "sample044" | "sample045" | "sample046" | "sample048" | "sample049" | "sample050" | "sample051" | "sample053" | "sample054" | "sample055" | "sample056", SimpleRouteJson>
export default samples
