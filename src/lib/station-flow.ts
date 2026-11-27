/**
 * The station-flow model, as arithmetic.
 *
 * A port of the isometric prototype: a ro-ro loop with two platforms, eight
 * reservation blocks, and trains that brake on a kinematic curve rather than on
 * a timer. Nothing here touches the DOM, so the page can draw it and a test can
 * step it.
 *
 * The units are the prototype's: tiles and frames at 60 Hz. `step()` advances
 * one frame; the page accumulates real time and calls it.
 */

export type Point = { x: number; y: number }
type Segment = { p1: Point; p2: Point; dx: number; dy: number; dist: number; startDist: number }
export type Route = { points: readonly Point[]; segments: Segment[]; totalDist: number }

export type Block = {
  id: string
  r1: readonly [number, number] | null
  r2: readonly [number, number] | null
  occupiedBy: number | null
}

export type Train = {
  id: number
  route: 0 | 1
  /** distance along the route, in tiles */
  d: number
  /** tiles per frame */
  v: number
  state: 'moving' | 'loading'
  loaded: boolean
  loadTimer: number
  /** index into TRAIN_COLOURS */
  colour: number
}

export type Params = {
  /** 1–100, mapped to a spawn interval the way the prototype does */
  spawnRate: number
  /** seconds at the platform */
  loadTime: number
  /** tiles per frame² */
  accel: number
}

export type Metrics = {
  queue: number
  throughput: number
  completed: number
  trains: number
  seconds: number
}

export const TILE = { w: 42, h: 21 }
export const GRID_SIZE = 20

/** Four carriages, 0.8 tiles apart — the prototype's consist. */
export const TRAIN_NODES = 4
export const NODE_SPACING = 0.8
/** Tiles per frame at 60 Hz: 9 tiles a second. */
export const MAX_SPEED = 0.15

const processPath = (points: readonly Point[]): Route => {
  let totalDist = 0
  const segments: Segment[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const dist = Math.hypot(dx, dy)
    segments.push({ p1, p2, dx, dy, dist, startDist: totalDist })
    totalDist += dist
  }
  return { points, segments, totalDist }
}

/** The prototype's two platform paths: shared throat, split, shared loop. */
const PATH_1: readonly Point[] = [
  { x: 1, y: 18 }, { x: 1, y: 15 }, { x: 5, y: 11 },
  { x: 8, y: 11 }, { x: 12, y: 11 },
  { x: 15, y: 11 }, { x: 18, y: 14 }, { x: 18, y: 18 },
  { x: 1, y: 18 },
]
const PATH_2: readonly Point[] = [
  { x: 1, y: 18 }, { x: 1, y: 15 }, { x: 5, y: 11 },
  { x: 5, y: 7 }, { x: 8, y: 7 }, { x: 12, y: 7 },
  { x: 15, y: 7 }, { x: 15, y: 11 }, { x: 18, y: 14 }, { x: 18, y: 18 },
  { x: 1, y: 18 },
]

export const ROUTES: readonly [Route, Route] = [processPath(PATH_1), processPath(PATH_2)]

/** Block ranges on each route, straight from the prototype. */
const BLOCK_SPEC: readonly Omit<Block, 'occupiedBy'>[] = [
  { id: 'entry', r1: [0, 6.5], r2: [0, 6.5] },
  { id: 'plat1', r1: [6.5, 12], r2: null },
  { id: 'plat2', r1: null, r2: [6.5, 14] },
  { id: 'exit1', r1: [12, 17], r2: null },
  { id: 'exit2', r1: null, r2: [14, 19] },
  { id: 'loop1', r1: [17, 25], r2: [19, 25] },
  { id: 'loop2', r1: [25, 35], r2: [25, 35] },
  { id: 'sink', r1: [35, 99], r2: [35, 99] },
]

/** Where each route stops to load. */
export const STATIONS: readonly { route: 0 | 1; dist: number }[] = [
  { route: 0, dist: 9 },
  { route: 1, dist: 11 },
]

export const positionOn = (route: Route, d: number): Point => {
  const clamped = Math.max(0, Math.min(d, route.totalDist))
  for (const segment of route.segments) {
    if (clamped >= segment.startDist && clamped <= segment.startDist + segment.dist) {
      const t = (clamped - segment.startDist) / segment.dist
      return { x: segment.p1.x + segment.dx * t, y: segment.p1.y + segment.dy * t }
    }
  }
  const last = route.points[route.points.length - 1]
  return { x: last.x, y: last.y }
}

const createBlocks = (): Block[] => BLOCK_SPEC.map((block) => ({ ...block, occupiedBy: null }))

/**
 * The simulation. Deterministic given the parameters: the only randomness is the
 * route a new train takes, and that is decided by which platform is emptier.
 */
export class StationFlow {
  params: Params = { spawnRate: 50, loadTime: 2, accel: 0.005 }
  trains: Train[] = []
  blocks: Block[] = createBlocks()
  completedAt: number[] = []
  frame = 0
  lastSpawn = 0
  queue = 0
  private nextId = 1

  constructor() {
    this.spawn()
  }

  private get loadFrames(): number {
    return Math.max(1, Math.round(this.params.loadTime * 60))
  }

  private spawn(): void {
    const onOne = this.trains.filter((train) => train.route === 0).length
    const onTwo = this.trains.filter((train) => train.route === 1).length
    const route: 0 | 1 = onOne > onTwo ? 1 : onTwo > onOne ? 0 : this.nextId % 2 === 0 ? 1 : 0
    this.trains.push({
      id: this.nextId,
      route,
      d: 0,
      v: MAX_SPEED,
      state: 'moving',
      loaded: false,
      loadTimer: 0,
      colour: this.nextId % 4,
    })
    this.nextId += 1
  }

  /** One frame at 60 Hz. */
  step(): void {
    this.frame += 1

    for (const block of this.blocks) block.occupiedBy = null
    for (const train of this.trains) {
      const head = train.d
      const tail = train.d - TRAIN_NODES * NODE_SPACING
      for (const block of this.blocks) {
        const range = train.route === 0 ? block.r1 : block.r2
        if (!range) continue
        if (head >= range[0] && tail <= range[1]) block.occupiedBy = train.id
      }
    }

    this.queue = 0
    const { accel } = this.params
    const braking = accel * 1.5
    const loadFrames = this.loadFrames

    for (let i = this.trains.length - 1; i >= 0; i--) {
      const train = this.trains[i]
      const route = ROUTES[train.route]
      let target = MAX_SPEED
      let obstacle = Number.POSITIVE_INFINITY
      let blockedBySignal = false

      for (const block of this.blocks) {
        const range = train.route === 0 ? block.r1 : block.r2
        if (!range) continue
        const gap = range[0] - train.d
        if (gap > 0 && block.occupiedBy !== null && block.occupiedBy !== train.id && gap < obstacle) {
          obstacle = gap
          blockedBySignal = true
        }
      }

      const station = STATIONS[train.route].dist
      const toStation = station - train.d
      if (train.state === 'moving' && !train.loaded && toStation > 0 && toStation < obstacle) {
        obstacle = toStation
        blockedBySignal = false
      }

      if (obstacle < 15) {
        const safe = Math.sqrt(2 * braking * Math.max(0, obstacle - 0.2))
        target = Math.min(MAX_SPEED, safe)
        if (obstacle <= 0.3) target = 0
      }

      if (blockedBySignal && train.v < 0.02) this.queue += 1

      if (train.state === 'moving' && !train.loaded && !blockedBySignal) {
        if (train.v <= 0.01 && obstacle <= 0.5) {
          train.state = 'loading'
          train.loadTimer = loadFrames
          train.v = 0
        }
      } else if (train.state === 'loading') {
        train.loadTimer -= 1
        target = 0
        if (train.loadTimer <= 0) {
          train.loaded = true
          train.state = 'moving'
        }
      }

      if (train.v < target) train.v = Math.min(target, train.v + accel)
      else if (train.v > target) train.v = Math.max(target, train.v - braking)
      if (train.v < 0) train.v = 0

      train.d += train.v

      if (train.d - TRAIN_NODES * NODE_SPACING > route.totalDist) {
        this.trains.splice(i, 1)
        this.completedAt.push(this.frame)
      }
    }

    const interval = 300 - this.params.spawnRate * 2.5
    if (this.frame - this.lastSpawn > interval && this.blocks[0].occupiedBy === null) {
      this.spawn()
      this.lastSpawn = this.frame
    }
  }

  /** Completed circuits in the last simulated minute. */
  throughput(): number {
    const windowStart = this.frame - 60 * 60
    return this.completedAt.filter((at) => at > windowStart).length
  }

  metrics(): Metrics {
    return {
      queue: this.queue,
      throughput: this.throughput(),
      completed: this.completedAt.length,
      trains: this.trains.length,
      seconds: this.frame / 60,
    }
  }
}

/**
 * Screen layout for the grid: the tile size that fits the canvas, and the origin
 * that centres the 20 × 20 board. Kept here so the page has no geometry in it.
 */
export const layoutFor = (width: number, height: number) => {
  const tileW = Math.max(12, Math.min(TILE.w, (width - 32) / 14))
  const tileH = tileW / 2
  return {
    tileW,
    tileH,
    originX: width / 2,
    originY: Math.max(8, (height - GRID_SIZE * tileH) / 2),
  }
}

export const iso = (
  point: Point,
  layout: { tileW: number; tileH: number; originX: number; originY: number },
): Point => ({
  x: layout.originX + (point.x - point.y) * (layout.tileW / 2),
  y: layout.originY + (point.x + point.y) * (layout.tileH / 2),
})
