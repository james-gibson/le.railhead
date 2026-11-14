import { Callout, Heading, Tag, TicketCard } from '@plop-ui/react'
import { GAPS, VERIFIED_AT } from '@/lib/gaps'
import { href } from '@/lib/base'

/**
 * The open holes, one ticket each.
 *
 * A gap is a queue item: it has a name, an attack, and the decision that is
 * still missing. A table would flatten that; a ticket keeps the three together
 * on one card, which is what `TicketCard` is for.
 */
export function KnownGaps() {
  return (
    <>
      <header className="stack">
        <p className="meta" style={{ margin: 0 }}>
          Live route · {GAPS.length} strict xfails at <span className="mono">{VERIFIED_AT}</span>
        </p>
        <Heading level={1}>What the verifier cannot stop yet</Heading>
        <p style={{ margin: 0, maxWidth: '62ch', fontSize: 17 }}>
          The threat model assumes an agent that can read and rewrite the action log and the state
          files under <span className="mono">run/</span>, and can call <span className="mono">rh</span>{' '}
          any way it likes — but cannot run its own engine and cannot touch the verifier. Each card
          below is a test that fails on purpose, named after a real attack.
        </p>
        <div className="row">
          <Tag tone="mustard" pattern="dots">
            open
          </Tag>
          <Tag tone="mint" pattern="stripes">
            8 of 13 closed
          </Tag>
          <span className="meta">
            from the red team pass recorded in <span className="mono">CHANGELOG.md</span>
          </span>
        </div>
      </header>

      <Callout title="A gap is published, not smoothed over" tone="warn">
        <p style={{ margin: 0 }}>
          These are not bugs the authors forgot. They are tests marked <span className="mono">xfail(strict=True)</span>{' '}
          so the suite stays honest: a fix that lands turns the test into a pass, and a fix that is
          reverted turns it red. The reasons are quoted from the tests, trimmed, at the pinned commit.
        </p>
      </Callout>

      <div className="grid" data-cols="2">
        {GAPS.map((gap, index) => (
          <TicketCard
            key={gap.test}
            meta={
              <span className="mono">
                GAP {index + 1} · {gap.test}
              </span>
            }
            title={gap.title}
            stub="open"
            tilt={index % 2 === 0 ? -0.6 : 0.5}
          >
            <div className="stack" data-gap="tight">
              <p style={{ margin: 0 }}>
                <b>The attack:</b> {gap.attack}
              </p>
              <p className="meta" style={{ margin: 0 }}>
                <b>What is missing:</b> {gap.fix}
              </p>
            </div>
          </TicketCard>
        ))}
      </div>

      <p className="meta" style={{ margin: 0 }}>
        The mechanisms these gaps sit inside are on{' '}
        <a href={href('/verify/proof-of-play')}>proof of play</a>. The full threat table is{' '}
        <span className="mono">docs/VERIFICATION.md</span> upstream.
      </p>
    </>
  )
}
