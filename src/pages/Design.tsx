import { Callout, Count, Heading, StatusDot, StickyNote, Tag } from '@plop-ui/react'
import { StatLine } from '@/components/plop/StatLine'
import { ReplayLegend } from '@/components/plop/StatusLegend'
import { href } from '@/lib/base'

/**
 * The design system, live.
 *
 * A child seed that swaps the UI library has to show the swap. This page lists
 * only the components the site actually uses, with the props it actually passes.
 * Anything absent from here is absent from the site, and the closing note says
 * so — a catalogue that lists unused components is a brochure.
 */
export function Design() {
  return (
    <>
      <header className="stack">
        <p className="meta" style={{ margin: 0 }}>
          Live route · no content file
        </p>
        <Heading level={1}>The paper the record is printed on</Heading>
        <p style={{ margin: 0, maxWidth: '62ch', fontSize: 17 }}>
          PlopUI: hand-drawn React components, MIT, installed as a dependency rather than copied.
          The parent seed uses a different library, and the pipeline did not change — that is the
          claim this page is here to make checkable.
        </p>
      </header>

      <section className="stack">
        <Heading level={2} id="paper">
          The surface
        </Heading>
        <div className="sheet stack" data-gap="tight">
          <p style={{ margin: 0 }}>
            <span className="mono">PlopProvider</span> at the root: <span className="mono">surface="kraft"</span>,{' '}
            <span className="mono">theme="system"</span>, <span className="mono">sound=&#123;false&#125;</span>,{' '}
            <span className="mono">reducedMotion="system"</span>.
          </p>
          <p className="meta" style={{ margin: 0 }}>
            Colour, shadow, corners and motion are PlopUI tokens (<span className="mono">--plop-*</span>).
            This site adds one grid and one prose stylesheet; there is no second palette.
          </p>
        </div>
      </section>

      <section className="stack">
        <Heading level={2} id="heading">
          Heading
        </Heading>
        <div className="sheet stack">
          <Heading level={2}>Lettering writes on for h1 and h2</Heading>
          <Heading level={3} scribble={false} writeOn={false}>
            A quiet h3, no scribble
          </Heading>
          <p className="meta" style={{ margin: 0 }}>
            <span className="mono">level</span> 1–3, <span className="mono">scribble</span> and{' '}
            <span className="mono">writeOn</span> off in the rail so the site name does not animate
            on every navigation.
          </p>
        </div>
      </section>

      <section className="stack">
        <Heading level={2} id="counts">
          Count and its decoder
        </Heading>
        <div className="sheet stack" data-gap="tight">
          <div className="row">
            <Count label="eleven models, aria-only">11</Count>
            <Count label="sixteen players including the free tier" tone="ink">
              16
            </Count>
            <Count label="one thousand five hundred and forty certified tasks" tone="ink" size="sm">
              1,540
            </Count>
          </div>
          <StatLine
            stats={[
              { value: 11, label: 'models in Arena 2' },
              { value: 16, label: 'players with the free tier' },
              { value: 1540, label: 'certified tasks' },
            ]}
          />
          <p className="meta" style={{ margin: 0 }}>
            A count's <span className="mono">label</span> is an accessible name, not a caption. Every
            row of counts on this site is followed by a visible stat line in the same order, so the
            numbers mean something without a screen reader.
          </p>
        </div>
      </section>

      <section className="stack">
        <Heading level={2} id="status">
          Status is the words
        </Heading>
        <div className="sheet stack" data-gap="tight">
          <ReplayLegend />
          <p className="meta" style={{ margin: 0 }}>
            <StatusDot tone="online">online</StatusDot> ·{' '}
            <StatusDot tone="busy">busy</StatusDot> ·{' '}
            <StatusDot tone="offline">offline</StatusDot> — the dot repeats the sentence; it never
            carries the meaning alone.
          </p>
        </div>
      </section>

      <section className="stack">
        <Heading level={2} id="tags">
          Tag
        </Heading>
        <div className="sheet stack" data-gap="tight">
          <div className="row">
            <Tag tone="mint" pattern="stripes">
              replay verified
            </Tag>
            <Tag tone="mustard" pattern="dots">
              certificate
            </Tag>
            <Tag tone="periwinkle" pattern="grid">
              for agent operations
            </Tag>
          </div>
          <p className="meta" style={{ margin: 0 }}>
            Washi tape is for status and section membership. The nav is ordinary links: making the
            rail out of stickers would mean the paper language meant nothing.
          </p>
        </div>
      </section>

      <section className="stack">
        <Heading level={2} id="callout">
          Callout
        </Heading>
        <Callout title="One per screen, before the action" tone="info">
          <p style={{ margin: 0 }}>
            A callout is where the page's thesis or its scope lives — the run-off rule on the front
            page, the projection-not-register note on the universe page. It is not decoration and
            never stacks.
          </p>
        </Callout>
      </section>

      <section className="stack">
        <Heading level={2} id="notes">
          Sticky note
        </Heading>
        <StickyNote tone="mint" footer="the note carries a footer, not a heading">
          Used once, on the front page, for the one fact about the build itself: the scheduled
          rebuild re-checks upstream.
        </StickyNote>
      </section>

      <p className="meta" style={{ margin: 0 }}>
        Not used, and therefore not listed: TicketCard, UnitCard, Eta, EmptyState, Tabs, forms,
        charts. See <a href={href('/ops/for-agents')}>the agent entry</a> for the machine view of
        this page.
      </p>
    </>
  )
}
