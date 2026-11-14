import { Heading, Tag } from '@plop-ui/react'
import { href } from '@/lib/base'
import { SECTIONS } from '@/lib/content'

export function NotFound() {
  return (
    <>
      <p className="meta" style={{ margin: 0 }}>
        404
      </p>
      <Heading level={1}>No page at this address.</Heading>
      <p style={{ margin: 0 }}>
        The path is the URL here, so a missing page is a missing file. Start from{' '}
        <a href={href('/')}>the front page</a>, or pick a section:
      </p>
      <div className="row">
        {SECTIONS.map((section) => (
          <Tag key={section.id} tone="periwinkle" pattern="grid">
            <a href={href(`/${section.id}`)}>{section.label}</a>
          </Tag>
        ))}
      </div>
    </>
  )
}
