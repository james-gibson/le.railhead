import type { ReactNode } from 'react'
import { PlopProvider } from '@plop-ui/react'

import '@plop-ui/fonts/fonts.css'
import '@plop-ui/react/styles.css'

/**
 * One provider, one paper, at the root.
 *
 * `kraft` because the record is an engineering log rather than a poster: it is
 * the surface that looks least like a marketing page. `sound` stays off (the
 * library defaults it off; the prop is here so the choice is visible), and
 * `reducedMotion="system"` follows the reader's own setting rather than
 * imposing a second animation budget.
 */
export function SitePaper({ children }: { children: ReactNode }) {
  return (
    <PlopProvider surface="kraft" theme="system" sound={false} reducedMotion="system">
      {children}
    </PlopProvider>
  )
}
