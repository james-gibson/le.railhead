import { Callout, Heading, StickyNote, Tag } from '@plop-ui/react'
import { CountRow } from '@/components/plop/StatLine'
import { ReplayDot, ReplayLegend } from '@/components/plop/StatusLegend'
import { ARENA, PLAYERS } from '@/lib/arena'
import { href } from '@/lib/base'
import { latestUpdate, pagesIn } from '@/lib/content'
import { shortSha, upstream } from '@/lib/upstream'

/**
 * The front page: the claim, the four numbers that size it, and the table it
 * is argued from. Nothing here is a number the reader cannot find again — the
 * figures come from `src/lib/arena.ts`, and that module cites the commit.
 */
export function Home() {
  const top = PLAYERS.slice(0, 4)

  return (
    <>
      <header className="stack">
        <p className="meta" style={{ margin: 0 }}>
          A child seed of le.gume · pinned to upstream{' '}
          <span className="mono">{shortSha(upstream.pinnedSha)}</span>
        </p>
        <Heading level={1}>The world is frozen while the model thinks.</Heading>
        <p style={{ margin: 0, maxWidth: '62ch', fontSize: 18, lineHeight: 1.6 }}>
          Railhead is a reinforcement-learning environment in which a language model plays{' '}
          <a href="https://www.openttd.org">OpenTTD</a> first person, from a shell, with the same
          commands a human player has. There is no autopilot and no helper script: if a road has to
          be laid, the model lays it, tile coordinate by tile coordinate. This site is the record of
          that project in local time — what it did, when, and what it cannot claim — and the shared
          context a research team publishes its changes against.
        </p>
      </header>

      <CountRow
        stats={[
          { value: ARENA.players, label: 'models in Arena 2' },
          { value: ARENA.players + ARENA.freeModels, label: 'players with the free tier' },
          { value: ARENA.tasks.toLocaleString('en-GB'), label: 'certified tasks' },
          { value: ARENA.divergences, label: 'replay divergences' },
        ]}
      />

      <Callout title="The score is the run-off year, not the last day" tone="info">
        <p style={{ margin: 0 }}>
          After the ten-year mandate the model is gone and the world keeps running for 365 more game
          days. The result is the company's net worth after year eleven. A company that looks good
          on the last day but cannot run itself pays for it. In Arena 2, one model's session ended in
          February 1963 at a usage limit; nobody ran its company for seven more years, and it still
          finished sixth.
        </p>
      </Callout>

      <section className="stack" aria-labelledby="scoreboard">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Heading level={2} id="scoreboard">
            Arena 2, in order
          </Heading>
          <Tag tone="mint">replay verified</Tag>
        </div>
        <p className="meta" style={{ margin: 0 }}>
          Net worth after the run-off year on <span className="mono">{ARENA.task}</span>: {ARENA.map},
          starting {ARENA.starts}. One game per model. {latestUpdate() === 'unknown' ? '' : 'Record updated '}
          {latestUpdate()}.
        </p>
        <ReplayLegend />
        <div className="sheet table-wrap">
          <table className="prose" style={{ margin: 0, maxWidth: 'none' }}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Model</th>
                <th scope="col">Harness</th>
                <th scope="col" style={{ textAlign: 'right' }}>
                  Net worth
                </th>
                <th scope="col">Replay</th>
              </tr>
            </thead>
            <tbody>
              {top.map((player, index) => (
                <tr key={player.model}>
                  <td className="mono">{index + 1}</td>
                  <td className="mono">{player.model}</td>
                  <td>{player.harness}</td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {player.netWorth}
                  </td>
                  <td>
                    <ReplayDot status={player.replay} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0 }}>
          <a href={href('/arena/scoreboard')}>All eleven, both baselines and the five free models</a>
        </p>
      </section>

      <div className="grid" data-cols="2">
        <div className="sheet stack">
          <Heading level={3}>Why the scoreboard does not trust the game</Heading>
          <p style={{ margin: 0 }}>
            The reward is computed from a replay of the action log in a fresh engine, not from the
            live game. After every wait the log carries a checksum of the world, and the replay must
            reproduce it.
          </p>
          <p style={{ margin: 0 }}>
            <a href={href('/verify/proof-of-play')}>The five mechanisms</a>
          </p>
        </div>
        <div className="sheet stack">
          <Heading level={3}>What it does not show</Heading>
          <p style={{ margin: 0 }}>
            One map, one game per model, no error bars. Second and third place are 2.5% apart.
            Community script AIs reach about £180M against Opus's £41.3M.
          </p>
          <p style={{ margin: 0 }}>
            <a href={href('/arena/what-it-does-not-show')}>The limits, stated by the authors</a>
          </p>
        </div>
      </div>

      <section className="stack" aria-labelledby="research">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Heading level={2} id="research">
            The studies team publishes here
          </Heading>
          <Tag tone="periwinkle" pattern="grid">
            shared context
          </Tag>
        </div>
        <div className="sheet stack">
          <p style={{ margin: 0, maxWidth: '68ch' }}>
            A research team studies economic questions by running them as OpenTTD simulations. They
            do <b>not</b> control Railhead: they pin it, cite it, and record which world a study was
            run in. Every research change — a stage move, a corrected finding, a new arm, a move to a
            new pin — is published through these docs, with the pin it was read against.
          </p>
          <p className="meta" style={{ margin: 0 }}>
            <a href={href('/studies')}>The register: three studies and the change log</a> ·{' '}
            <a href={href('/research/how-a-change-is-published')}>how a change is published</a> ·{' '}
            <a href={href('/research/context')}>what these docs provide</a>
          </p>
        </div>
      </section>

      <StickyNote tone="mustard" footer={`upstream ${shortSha(upstream.pinnedSha)}, checked ${upstream.checkedAt.slice(0, 10)}`}>
        This site is rebuilt on a schedule and re-checks the upstream repository on every build. If
        the upstream head has moved past the pin, the page says so rather than quietly serving the
        old record as current.
      </StickyNote>

      <p className="meta" style={{ margin: 0 }}>
        {pagesIn('brief').length + pagesIn('arena').length + pagesIn('verify').length + pagesIn('ops').length}{' '}
        pages plus the <a href={href('/universe')}>universe</a> and{' '}
        <a href={href('/design')}>design</a> routes. Start with{' '}
        <a href={href('/brief/what-railhead-is')}>what Railhead is</a>.
      </p>
    </>
  )
}
