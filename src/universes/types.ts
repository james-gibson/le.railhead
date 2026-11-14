/**
 * The subset of local-time's `Universe` shape this seed emits.
 *
 * Type-only on purpose: `james-gibson/local-time` is not published as a package,
 * and the seed must build from a clean checkout with no private dependency. The
 * field names, enum string values and nanosecond timestamps match
 * `local-time` → `src/core/types.ts`, so this module is a structural `Universe`
 * and can be copied into a local-time registry unchanged.
 *
 * `TimePrecision` is a numeric enum upstream; `DAY_NS` and `SECOND_NS` are its
 * `DAY` and `SECOND` values.
 */
export const SECOND_NS = 1_000_000_000
export const DAY_NS = 86_400_000_000_000

export type LocalTimeEpoch = {
  epochId?: string
  start?: bigint
  end?: bigint
  startTime?: bigint
  endTime?: bigint
  precision: number
  description?: string
  /** Set on a `zero_reference` epoch only; local-time reads these from the layer. */
  zeroPoint?: bigint
  zeroEvent?: string
  beforePrefix?: string
  afterPrefix?: string
  relativeFormat?: string
  zeroStatus?: 'established' | 'presumed' | 'unestablished'
}

export type LocalTimeSegment = {
  id: string
  start: bigint
  end: bigint
  type: 'sequence' | 'act' | 'scene' | 'phase' | 'countdown' | 'mission_phase'
  status?: 'active' | 'inactive' | 'suspended' | 'overturned' | 'amended'
  description?: string
}

export type LocalTimeKeyframe = {
  id: string
  timestamp: bigint
  significance: number
  tags: string[]
  description?: string
  certainty?: number
  precision?: number
  type?: string
  /** The zero-relative label, e.g. `railhead-build:T+02:26:00`. */
  address?: string
}

export type LocalTimeUniverse = {
  universeId: string
  type: 'TECHNOLOGY'
  identifiers: {
    primary: string
    aliases?: string[]
  }
  realityRelation: {
    type: 'documentary'
    fictionalizationDegree: number
    realityAnchors: Array<{
      realEventId: string
      relationshipType: 'documents'
      confidence: number
      evidence: string[]
    }>
  }
  attribution: {
    copyright: { holders: string[]; year: number; status: 'active' }
    citations_required: boolean
    usage_restrictions: string[]
    sources: string[]
  }
  connections: {
    natural: { parentUniverses: string[] }
  }
  layers: Array<{
    layerId: string
    type: 'primary'
    epochs: Record<string, LocalTimeEpoch>
  }>
  epochs: Record<string, LocalTimeEpoch>
  temporalStructure: {
    segments: LocalTimeSegment[]
    keyframes: LocalTimeKeyframe[]
    windows: { strategy: 'time_based'; avgWindowSize: bigint }
  }
  metadata: {
    canonicalName: string
    creators: string[]
    released: Date
    cultural_significance: number
    [key: string]: unknown
  }
}
