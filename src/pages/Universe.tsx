import { Callout, Heading, Tag } from '@plop-ui/react'
import { CountRow } from '@/components/plop/StatLine'
import { railheadUniverse as universe } from '@/universes/railhead'
import { href } from '@/lib/base'

const iso = (ns: bigint) => new Date(Number(ns / 1_000_000n)).toISOString()

const day = (ns: bigint) => iso(ns).slice(0, 10)

/**
 * The imported universe, rendered from the module the build ships.
 *
 * This is a live route, not a Markdown page: it reads `src/universes/railhead.ts`
 * directly, so the page cannot describe a universe the site does not carry.
 */
export function Universe() {
  const zero = universe.layers[0].epochs.zero_reference
  const segments = universe.temporalStructure.segments
  const keyframes = [...universe.temporalStructure.keyframes].sort((a, b) =>
    a.timestamp < b.timestamp ? -1 : 1,
  )
  return (
    <>
      <header className="stack">
        <p className="meta" style={{ margin: 0 }}>
          Live route · <span className="mono">{universe.universeId}</span>
        </p>
        <Heading level={1}>The record, in local time</Heading>
        <p style={{ margin: 0, maxWidth: '62ch', fontSize: 17 }}>
          Railhead imported as a local-time universe: one epoch with a declared zero, four phases,
          and sixteen keyframes — each one a commit, a tag, a published result or a document at the
          pinned commit. The address is the point: <span className="mono">T+02:05:45</span> is when a
          model first played, and it is a number you can check against the log.
        </p>
        <div className="row">
          <Tag tone="mint" pattern="stripes">
            zero {zero.zeroStatus}
          </Tag>
          <Tag tone="periwinkle" pattern="grid">
            {universe.type.toLowerCase()}
          </Tag>
          <span className="meta">
            parent <a href="https://github.com/OpenTTD/OpenTTD">{String(universe.connections.natural.parentUniverses[0])}</a>
          </span>
        </div>
      </header>

      <Callout title="This is a projection, not the register" tone="info">
        <p style={{ margin: 0 }}>
          The record of truth is the vault document <span className="mono">kb/lore/lore/railhead.md</span>,
          which is enrolled in the local-time sync. The registry entry is{' '}
          <span className="mono">local-time/src/config/universes/openttd/railhead.ts</span>. This
          page renders the copy this site carries, so the seed still builds and explains itself from
          a clean checkout with no private dependency.
        </p>
      </Callout>

      <CountRow
        stats={[
          { value: keyframes.length, label: 'keyframes' },
          { value: segments.length, label: 'phases' },
          {
            value: Math.round(
              (Number(keyframes.at(-1)!.timestamp - keyframes[0].timestamp) / 1e9 / 86400) * 10,
            ) / 10,
            label: 'days from scaffold to pin',
          },
          { value: universe.attribution.sources.length, label: 'cited sources' },
        ]}
      />

      <section className="stack">
        <Heading level={2} id="zero">
          The zero
        </Heading>
        <div className="sheet stack" data-gap="tight">
          <p style={{ margin: 0 }}>
            <b>{iso(zero.zeroPoint!)}</b> — {zero.zeroEvent}
          </p>
          <p className="meta" style={{ margin: 0 }}>
            Addresses read <span className="mono">{zero.beforePrefix}HH:MM:SS</span> /{' '}
            <span className="mono">{zero.afterPrefix}HH:MM:SS</span>, from the first commit rather
            than from the arena start. The scaffold is when the project exists; the arena is what it
            did two hours later.
          </p>
          <p className="meta" style={{ margin: 0 }}>
            {universe.realityRelation.type}, fictionalisation{' '}
            <span className="mono">{universe.realityRelation.fictionalizationDegree}</span>. The game
            world is the fiction; the repository, its commits, its releases and its results are real.
          </p>
        </div>
      </section>

      <section className="stack">
        <Heading level={2} id="phases">
          Phases
        </Heading>
        <div className="sheet table-wrap">
          <table className="prose" style={{ margin: 0, maxWidth: 'none' }}>
            <thead>
              <tr>
                <th scope="col">Phase</th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">What it was</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment) => (
                <tr key={segment.id}>
                  <td className="mono">{segment.id}</td>
                  <td className="mono">{day(segment.start)}</td>
                  <td className="mono">{day(segment.end)}</td>
                  <td>{segment.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stack">
        <Heading level={2} id="keyframes">
          Keyframes
        </Heading>
        <ol className="timeline">
          {keyframes.map((keyframe) => (
            <li key={keyframe.id}>
              <span className="address">{keyframe.address}</span>
              <span>
                <b>{keyframe.id.replace(/-/g, ' ')}</b>{' '}
                <span className="meta mono">{iso(keyframe.timestamp).slice(0, 16)}Z</span>
                <br />
                {keyframe.description}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="stack">
        <Heading level={2} id="attribution">
          Attribution
        </Heading>
        <div className="sheet stack" data-gap="tight">
          <p style={{ margin: 0 }}>
            {universe.attribution.copyright.holders.join(', ')},{' '}
            <span className="mono">{universe.attribution.copyright.year}</span>.{' '}
            {universe.attribution.usage_restrictions.join(' ')}
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
            {universe.attribution.sources.map((source) => (
              <li key={source} className="meta">
                {source}
              </li>
            ))}
          </ul>
          <p className="meta" style={{ margin: 0 }}>
            The module is <span className="mono">src/universes/railhead.ts</span>;{' '}
            <a href={href('/ops/schedule')}>how the pin is checked</a>.
          </p>
        </div>
      </section>

      <p className="meta" style={{ margin: 0 }}>
        <a href={href('/brief/provenance')}>Provenance and the version chain</a>
      </p>
    </>
  )
}
