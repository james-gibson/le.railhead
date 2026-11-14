import { Callout, Heading, StatusDot, Tag } from '@plop-ui/react'
import { CountRow } from '@/components/plop/StatLine'
import { PUBLICATIONS, STAGE_MEANING, STUDIES, TEAM, type Stage } from '@/lib/studies'
import { href } from '@/lib/base'
import { shortSha, upstream } from '@/lib/upstream'

const TONE: Record<Stage, 'online' | 'busy' | 'offline'> = {
  design: 'busy',
  running: 'online',
  analysis: 'online',
  closed: 'offline',
}

/**
 * The register: what the team is studying, at which stage, and against which pin.
 *
 * A live route, not a Markdown page, because the register is data. The study
 * pages stay where they are owned; this page carries the question, the stage,
 * and the upstream pid the study is being described against, so a reader can
 * see the drift before they read a claim.
 */
export function Studies() {
  return (
    <>
      <header className="stack">
        <p className="meta" style={{ margin: 0 }}>
          Live route · register seeded from the team’s own pages
        </p>
        <Heading level={1}>The studies register</Heading>
        <p style={{ margin: 0, maxWidth: '62ch', fontSize: 17 }}>
          The team does not control Railhead. They pin it, cite it, and run studies against it —
          and they publish every research change through these docs. This page is the register: one
          row per study, its question, its stage, and the upstream commit it is being described
          against right now.
        </p>
        <div className="row">
          <Tag tone="mint" pattern="stripes">
            shared context
          </Tag>
          <Tag tone="periwinkle" pattern="grid">
            {STUDIES.length} studies
          </Tag>
          <span className="meta">
            study pages live at{' '}
            <a href={TEAM.studiesIndex}>{TEAM.dashboard.replace(/^https:\/\//, '')}</a>
          </span>
        </div>
      </header>

      <CountRow
        stats={[
          { value: STUDIES.filter((study) => study.stage === 'running').length, label: 'running' },
          { value: STUDIES.filter((study) => study.stage === 'analysis').length, label: 'in analysis' },
          { value: STUDIES.filter((study) => study.stage === 'design').length, label: 'still in design' },
          { value: PUBLICATIONS.length, label: 'changes published here' },
        ]}
      />

      <Callout title="The stage is the study’s, not this page’s" tone="info">
        <p style={{ margin: 0 }}>
          Each stage is copied from the study page’s own frontmatter at the date shown on its row.
          This register never promotes a study: if the two disagree, the study page is right and this
          page is stale, which is what a published change is for.
        </p>
      </Callout>

      <section className="stack">
        <Heading level={2} id="register">
          Register
        </Heading>
        <div className="sheet table-wrap">
          <table className="prose" style={{ margin: 0, maxWidth: 'none' }}>
            <thead>
              <tr>
                <th scope="col">Study</th>
                <th scope="col">Stage</th>
                <th scope="col">Study page updated</th>
                <th scope="col">Pin</th>
              </tr>
            </thead>
            <tbody>
              {STUDIES.map((study) => (
                <tr key={study.slug}>
                  <td>
                    <a href={study.url}>{study.title}</a>
                    <br />
                    <span className="meta">{study.question}</span>
                  </td>
                  <td>
                    <StatusDot tone={TONE[study.stage]}>{study.stage}</StatusDot>
                    <br />
                    <span className="meta">{STAGE_MEANING[study.stage]}</span>
                  </td>
                  <td className="mono">{study.studyUpdated}</td>
                  <td className="mono">{shortSha(upstream.pinnedSha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="meta" style={{ margin: 0 }}>
          What each study page says beyond its stage is recorded there, not here:{' '}
          {STUDIES.map((study, index) => (
            <span key={study.slug}>
              {index > 0 ? ' · ' : ''}
              <a href={study.url}>{study.slug}</a>
            </span>
          ))}
          . The register keeps the index; the study keeps the argument.
        </p>
      </section>

      <section className="stack">
        <Heading level={2} id="published">
          Published through these docs
        </Heading>
        <p className="meta" style={{ margin: 0 }}>
          Newest first. A row is added when a research change is published here — a stage change, a
          corrected finding, a new arm, or a move to a new pin. The pin is the upstream commit the
          change was read against, not the commit the docs are built from.
        </p>
        <div className="sheet table-wrap">
          <table className="prose" style={{ margin: 0, maxWidth: 'none' }}>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Study</th>
                <th scope="col">Change</th>
                <th scope="col">Pin</th>
              </tr>
            </thead>
            <tbody>
              {PUBLICATIONS.map((publication) => (
                <tr key={`${publication.date}-${publication.study}`}>
                  <td className="mono">{publication.date}</td>
                  <td className="mono">{publication.study}</td>
                  <td>{publication.change}</td>
                  <td className="mono">{publication.pin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="meta" style={{ margin: 0 }}>
          Nothing before 2026-11-14 is reconstructed: the{' '}
          <a href={TEAM.dashboard}>team’s dashboard</a> is the record of that period, and inventing
          rows here would make this log a story rather than a log.
        </p>
      </section>

      <p className="meta" style={{ margin: 0 }}>
        How a change gets published: <a href={href('/research/how-a-change-is-published')}>the process</a>.
        The context these studies cite: <a href={href('/research/context')}>what these docs provide</a>.
        The upstream drift: <a href={href('/ops/schedule')}>the daily check</a>.
      </p>
    </>
  )
}
