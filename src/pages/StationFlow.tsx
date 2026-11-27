import { useEffect, useRef, useState } from 'react'
import { Button, Callout, Heading, Sheet, Slider, Tag, useReducedMotion } from '@plop-ui/react'
import { href } from '@/lib/base'
import {
  GRID_SIZE,
  MAX_SPEED,
  NODE_SPACING,
  ROUTES,
  STATIONS,
  StationFlow as Sim,
  TRAIN_NODES,
  iso,
  layoutFor,
  positionOn,
  type Metrics,
} from '@/lib/station-flow'

const COLOUR_KEYS = ['mint', 'periwinkle', 'mustard', 'bubblegum'] as const

type Palette = {
  ink: string
  soft: string
  line: string
  sheet: string
  clear: string
  held: string
  platform: string
  trains: readonly string[]
}

const readPalette = (): Palette => {
  const style = getComputedStyle(document.documentElement)
  const value = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback
  return {
    ink: value('--plop-ink', '#231f19'),
    soft: value('--plop-ink-soft', '#6c6557'),
    line: value('--plop-line-a', '#d6cdbc'),
    sheet: value('--plop-sheet', '#fbf8f0'),
    clear: value('--plop-fill-mint', '#9ed3b3'),
    held: value('--plop-fill-tomato', '#ef9f9b'),
    platform: value('--plop-fill-periwinkle', '#b7c1ef'),
    trains: [
      value('--plop-fill-periwinkle', '#b7c1ef'),
      value('--plop-fill-bubblegum', '#f3aecd'),
      value('--plop-fill-mustard', '#eed08a'),
      value('--plop-fill-mint', '#9ed3b3'),
    ],
  }
}

/** A cube with three faces, shaded by darkening the same fill. */
const cube = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  colour: string,
) => {
  const w = size
  const h = size * 0.8
  ctx.fillStyle = colour
  ctx.beginPath()
  ctx.moveTo(x, y - h)
  ctx.lineTo(x + w, y - h - w / 2)
  ctx.lineTo(x, y - h - w)
  ctx.lineTo(x - w, y - h - w / 2)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = 'rgba(0,0,0,0.16)'
  ctx.beginPath()
  ctx.moveTo(x - w, y - h - w / 2)
  ctx.lineTo(x, y - h)
  ctx.lineTo(x, y)
  ctx.lineTo(x - w, y - w / 2)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.moveTo(x, y - h)
  ctx.lineTo(x + w, y - h - w / 2)
  ctx.lineTo(x + w, y - w / 2)
  ctx.lineTo(x, y)
  ctx.closePath()
  ctx.fill()
}

const signal = (ctx: CanvasRenderingContext2D, x: number, y: number, held: boolean, palette: Palette) => {
  ctx.fillStyle = palette.soft
  ctx.fillRect(x - 1.5, y - 14, 3, 14)
  ctx.fillStyle = held ? palette.held : palette.clear
  ctx.beginPath()
  ctx.arc(x, y - 17, 3.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 0.25
  ctx.beginPath()
  ctx.arc(x, y - 17, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
}

const draw = (
  ctx: CanvasRenderingContext2D,
  sim: Sim,
  width: number,
  height: number,
  palette: Palette,
) => {
  const layout = layoutFor(width, height)
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = palette.sheet
  ctx.fillRect(0, 0, width, height)

  // The board.
  ctx.strokeStyle = palette.line
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 1
  for (let i = 0; i <= GRID_SIZE; i++) {
    const a = iso({ x: i, y: 0 }, layout)
    const b = iso({ x: i, y: GRID_SIZE }, layout)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
    const c = iso({ x: 0, y: i }, layout)
    const d = iso({ x: GRID_SIZE, y: i }, layout)
    ctx.beginPath()
    ctx.moveTo(c.x, c.y)
    ctx.lineTo(d.x, d.y)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Track bed, then the rails.
  for (const route of ROUTES) {
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'
    ctx.lineWidth = 7
    ctx.lineJoin = 'round'
    ctx.beginPath()
    route.points.forEach((point, index) => {
      const screen = iso(point, layout)
      if (index === 0) ctx.moveTo(screen.x, screen.y + 4)
      else ctx.lineTo(screen.x, screen.y + 4)
    })
    ctx.stroke()

    ctx.strokeStyle = palette.soft
    ctx.lineWidth = 4
    ctx.beginPath()
    route.points.forEach((point, index) => {
      const screen = iso(point, layout)
      if (index === 0) ctx.moveTo(screen.x, screen.y)
      else ctx.lineTo(screen.x, screen.y)
    })
    ctx.stroke()
  }

  // Platforms.
  for (const station of STATIONS) {
    const point = positionOn(ROUTES[station.route], station.dist)
    const screen = iso(point, layout)
    ctx.fillStyle = palette.platform
    ctx.globalAlpha = 0.45
    ctx.beginPath()
    ctx.roundRect(screen.x - 26, screen.y - 13, 52, 26, 4)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // Signals at each block boundary on the route it belongs to.
  for (const block of sim.blocks) {
    if (block.id === 'sink') continue
    const ranges: { route: 0 | 1; range: readonly [number, number] | null }[] = [
      { route: 0, range: block.r1 },
      { route: 1, range: block.r2 },
    ]
    for (const { route, range } of ranges) {
      if (!range) continue
      if (route === 1 && block.r1 && block.r1[0] === block.r2?.[0]) continue
      const point = positionOn(ROUTES[route], range[0])
      const screen = iso(point, layout)
      signal(ctx, screen.x, screen.y, block.occupiedBy !== null, palette)
    }
  }

  // Trains, painted back to front.
  const ordered = sim.trains
    .map((train) => {
      const screen = iso(positionOn(ROUTES[train.route], train.d), layout)
      return { train, y: screen.y }
    })
    .sort((a, b) => a.y - b.y)

  for (const { train } of ordered) {
    const colour = palette.trains[train.colour % palette.trains.length]
    for (let node = TRAIN_NODES - 1; node >= 0; node--) {
      const at = train.d - node * NODE_SPACING
      if (at < 0 || at > ROUTES[train.route].totalDist) continue
      const screen = iso(positionOn(ROUTES[train.route], at), layout)
      cube(ctx, screen.x, screen.y, 9, colour)
    }
  }

  // Scale hint: the same tile size the layout chose, so the canvas is honest
  // about how big a tile is when the card is narrow.
  ctx.fillStyle = palette.soft
  ctx.font = '11px ui-monospace, monospace'
  ctx.fillText(`tile ${Math.round(layout.tileW)}px · ${GRID_SIZE}×${GRID_SIZE}`, 12, height - 12)
}

const formatRate = (value: number) => (value < 30 ? 'Low' : value > 70 ? 'High' : 'Medium')
const formatAccel = (value: number) => (value < 0.004 ? 'Slow' : value > 0.01 ? 'Fast' : 'Normal')

export function StationFlow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const simRef = useRef(new Sim())
  const pausedRef = useRef(true)
  const reduced = useReducedMotion()

  const [paused, setPaused] = useState(true)
  const [spawnRate, setSpawnRate] = useState(50)
  const [loadTime, setLoadTime] = useState(2)
  const [accel, setAccel] = useState(0.005)
  const [metrics, setMetrics] = useState<Metrics>({
    queue: 0,
    throughput: 0,
    completed: 0,
    trains: 0,
    seconds: 0,
  })


  useEffect(() => {
    pausedRef.current = paused || reduced
  }, [paused, reduced])

  useEffect(() => {
    simRef.current.params = { spawnRate, loadTime, accel }
  }, [spawnRate, loadTime, accel])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let palette = readPalette()
    const size = { width: wrap.clientWidth, height: wrap.clientHeight }

    const measure = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      size.width = wrap.clientWidth
      size.height = wrap.clientHeight
      canvas.width = Math.max(1, Math.round(size.width * dpr))
      canvas.height = Math.max(1, Math.round(size.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    measure()

    const observer = new ResizeObserver(() => {
      measure()
      draw(ctx, simRef.current, size.width, size.height, palette)
    })
    observer.observe(wrap)

    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    const repaint = () => {
      palette = readPalette()
      draw(ctx, simRef.current, size.width, size.height, palette)
    }
    scheme.addEventListener('change', repaint)

    let raf = 0
    let last = performance.now()
    let acc = 0
    let lastMetrics = 0

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const elapsed = Math.min(100, now - last)
      last = now
      if (!pausedRef.current) {
        acc += elapsed
        const steps = Math.min(6, Math.floor(acc / (1000 / 60)))
        for (let i = 0; i < steps; i++) simRef.current.step()
        acc -= steps * (1000 / 60)
      }
      draw(ctx, simRef.current, size.width, size.height, palette)
      if (now - lastMetrics > 160) {
        lastMetrics = now
        setMetrics(simRef.current.metrics())
      }
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      scheme.removeEventListener('change', repaint)
    }
  }, [])

  const reset = () => {
    simRef.current = new Sim()
    simRef.current.params = { spawnRate, loadTime, accel }
    setMetrics(simRef.current.metrics())
  }

  return (
    <>
      <header className="stack">
        <p className="meta" style={{ margin: 0 }}>
          Live route · simulated in the browser, no engine
        </p>
        <Heading level={1}>Station flow</Heading>
        <p style={{ margin: 0, maxWidth: '62ch', fontSize: 17 }}>
          A ro-ro loop with two platforms, eight reservation blocks and trains that brake on a
          kinematic curve. The board is the prototype&apos;s teaching layout, not a map from the
          catalog: what it shows is the signalling rule the tasks are played under — a block is
          reserved, a signal holds, and a queue is the cost of the hold.
        </p>
        <div className="row">
          <Tag tone="mint" pattern="stripes">
            clear
          </Tag>
          <Tag tone="tomato" pattern="dots">
            occupied / reserved
          </Tag>
          <span className="meta">
            max {MAX_SPEED * 60} tiles/s · {TRAIN_NODES} carriages
          </span>
        </div>
      </header>

      <div className="grid" data-cols="2">
        <Sheet tape="none">
          <div
            ref={wrapRef}
            style={{ height: 420, overflow: 'hidden', borderRadius: 8 }}
          >
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="An isometric model of a two-platform rail loop. Trains move along two routes, and their blocks are reserved one at a time; a signal turns red while its block is held."
              style={{ display: 'block', width: '100%', height: '100%' }}
            />
          </div>
        </Sheet>

        <div className="stack">
          <Sheet tape="mint">
            <div className="stack" data-gap="tight">
              <p className="meta" style={{ margin: 0 }}>
                Queue (Wq) · trains held at a signal
              </p>
              <p className="mono" style={{ margin: 0, fontSize: 34, lineHeight: 1 }}>
                {metrics.queue}
              </p>
              <p className="meta" style={{ margin: 0 }}>
                Throughput · {metrics.throughput} circuits per simulated minute
              </p>
              <p className="mono" style={{ margin: 0, fontSize: 34, lineHeight: 1 }}>
                {metrics.throughput.toFixed(1)}
              </p>
              <p className="meta" style={{ margin: 0 }}>
                {metrics.completed} completed · {metrics.trains} on the board ·{' '}
                {Math.floor(metrics.seconds)}s simulated
              </p>
            </div>
          </Sheet>

          <Sheet tape="mustard">
            <div className="stack">
              <Slider
                label="Arrival rate (λ)"
                min={1}
                max={100}
                value={spawnRate}
                onValueChange={setSpawnRate}
                formatValue={formatRate}
                showValue
                tone="periwinkle"
              />
              <p className="meta" style={{ margin: 0 }}>
                How often a new train enters the loop, if the entry block is clear.
              </p>

              <Slider
                label="Loading time (1/μ)"
                min={0.5}
                max={10}
                step={0.5}
                value={loadTime}
                onValueChange={setLoadTime}
                formatValue={(value) => `${value.toFixed(1)}s`}
                showValue
                tone="mint"
              />
              <p className="meta" style={{ margin: 0 }}>
                Time spent at the platform. This is the dwell that makes a queue.
              </p>

              <Slider
                label="Acceleration"
                min={0.001}
                max={0.02}
                step={0.001}
                value={accel}
                onValueChange={setAccel}
                formatValue={formatAccel}
                showValue
                tone="mustard"
              />
              <p className="meta" style={{ margin: 0 }}>
                Starting and stopping clearance. Braking is 1.5× this.
              </p>

              <div className="row">
                <Button
                  variant="ink"
                  size="sm"
                  tilt={0}
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? 'Play' : 'Pause'}
                </Button>
                <Button variant="plain" size="sm" tilt={0} onClick={reset}>
                  Reset
                </Button>
              </div>
              {reduced ? (
                <p className="meta" style={{ margin: 0 }}>
                  Reduced motion is on, so the model stays paused until you press Play.
                </p>
              ) : null}
            </div>
          </Sheet>
        </div>
      </div>

      <Callout title="This is a model, not a replay" tone="info">
        <p style={{ margin: 0 }}>
          No engine is running and no task is being played: the numbers above are computed by the
          simulation in front of you, not read from a log. For what a real task scores, read
          <a href={href('/verify/simops')}> simops</a> (a route to repair) or
          <a href={href('/verify/tycoon')}> tycoon</a> (net worth after the run-off). The queue and
          throughput here are the ordinary queueing quantities Wq and 1/μ, shown on a board small
          enough to watch.
        </p>
      </Callout>
    </>
  )
}
