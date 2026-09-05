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
export declare const sample032: SimpleRouteJson
export declare const sample033: SimpleRouteJson
export declare const sample034: SimpleRouteJson
export declare const sample035: SimpleRouteJson
export declare const sample036: SimpleRouteJson
export declare const sample037: SimpleRouteJson
export declare const sample038: SimpleRouteJson
export declare const sample039: SimpleRouteJson
export declare const sample040: SimpleRouteJson
export declare const sample041: SimpleRouteJson
export declare const sample042: SimpleRouteJson
export declare const sample043: SimpleRouteJson
export declare const sample044: SimpleRouteJson
export declare const sample045: SimpleRouteJson
export declare const sample046: SimpleRouteJson
export declare const sample047: SimpleRouteJson
export declare const sample048: SimpleRouteJson
export declare const sample049: SimpleRouteJson
export declare const sample050: SimpleRouteJson
export declare const sample051: SimpleRouteJson
export declare const sample052: SimpleRouteJson
export declare const sample053: SimpleRouteJson
export declare const sample054: SimpleRouteJson
export declare const sample055: SimpleRouteJson
export declare const sample056: SimpleRouteJson
export declare const samples: Record<"sample001" | "sample002" | "sample003" | "sample004" | "sample005" | "sample006" | "sample010" | "sample011" | "sample012" | "sample013" | "sample020" | "sample025" | "sample032" | "sample033" | "sample034" | "sample035" | "sample036" | "sample037" | "sample038" | "sample039" | "sample040" | "sample041" | "sample042" | "sample043" | "sample044" | "sample045" | "sample046" | "sample047" | "sample048" | "sample049" | "sample050" | "sample051" | "sample052" | "sample053" | "sample054" | "sample055" | "sample056", SimpleRouteJson>
export default samples
