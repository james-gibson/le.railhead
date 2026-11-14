import { Count } from '@plop-ui/react'

/**
 * The visible decoder for a row of `Count` stickers.
 *
 * `Count`'s `label` is an accessible name, not a caption: eight counts in a row
 * read to a sighted reader as eight bare numbers. This line prints the same
 * numbers with their labels, in the same order, so the row means something
 * without a screen reader.
 */
export type Stat = { value: number | string; label: string }

export function StatLine({ stats }: { stats: Stat[] }) {
  return (
    <p className="meta" style={{ margin: 0 }}>
      {stats.map((stat, index) => (
        <span key={stat.label}>
          <b className="mono">{stat.value}</b> {stat.label}
          {index < stats.length - 1 ? ' · ' : ''}
        </span>
      ))}
    </p>
  )
}

/** A row of counts plus its visible decoder, kept together so they cannot drift. */
export function CountRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="stack" data-gap="tight">
      <div className="row">
        {stats.map((stat, index) => (
          <Count
            key={stat.label}
            label={`${stat.label}: ${stat.value}`}
            tone={index === 0 ? 'tomato' : 'ink'}
          >
            {stat.value}
          </Count>
        ))}
      </div>
      <StatLine stats={stats} />
    </div>
  )
}
