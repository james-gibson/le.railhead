import { StatusDot, Tag } from '@plop-ui/react'
import { REPLAY_MEANING, type Replay } from '@/lib/arena'

const TONE: Record<Replay, 'online' | 'busy' | 'offline'> = {
  valid: 'online',
  certificate: 'busy',
  none: 'offline',
}

/**
 * One vocabulary, defined once per screen.
 *
 * A dot or a tag repeats what the words already say; it never replaces them.
 * Every page that shows a replay verdict shows this legend above the table, so
 * "replay valid" and "certificate" mean the same thing everywhere on the site.
 */
export function ReplayDot({ status }: { status: Replay }) {
  return <StatusDot tone={TONE[status]}>{REPLAY_MEANING[status].label}</StatusDot>
}

export function ReplayTag({ status }: { status: Replay }) {
  return (
    <Tag tone={status === 'valid' ? 'mint' : 'mustard'} pattern={status === 'valid' ? 'stripes' : 'dots'}>
      {REPLAY_MEANING[status].label}
    </Tag>
  )
}

export function ReplayLegend() {
  return (
    <dl className="stack" data-gap="tight" style={{ margin: 0 }}>
      {(Object.keys(REPLAY_MEANING) as Replay[]).map((status) => (
        <div key={status} className="row" style={{ alignItems: 'baseline', gap: 10 }}>
          <dt style={{ minWidth: 150 }}>
            <ReplayDot status={status} />
          </dt>
          <dd className="meta" style={{ margin: 0 }}>
            {REPLAY_MEANING[status].meaning}
          </dd>
        </div>
      ))}
    </dl>
  )
}
