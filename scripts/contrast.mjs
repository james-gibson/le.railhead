#!/usr/bin/env node
/**
 * The contrast gate.
 *
 * The site paints with PlopUI tokens, and PlopUI splits them in two: the
 * surface tokens (`--plop-bg-*`, `--plop-on-*`) come in a light and a dark
 * variant, while the paper tokens (`--plop-sheet`, `--plop-track`,
 * `--plop-ink`) are light only. Mixing the halves — light-only paper with a
 * dark-variant ink — is how `.sheet` shipped cream text on cream paper at
 * 1.00:1 for every dark-mode reader.
 *
 * So the gate reads the values out of the library's own stylesheet rather than
 * restating them here: if PlopUI changes a token, this measures the change. The
 * pairs below are the ones `src/index.css` actually paints, each with the floor
 * its type size has to clear.
 */
import { readFileSync } from 'node:fs'

const css = readFileSync('node_modules/@plop-ui/react/dist/styles.css', 'utf8')

const channel = (value) => {
  const v = value / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

const parseHex = (hex) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

const luminance = (hex) => {
  const [r, g, b] = parseHex(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const contrast = (a, b) => {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** The declarations of the first rule whose selector is exactly `selector`. */
const rule = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`))
  if (!match) throw new Error(`contrast: no rule for "${selector}" in the PlopUI stylesheet`)
  const declarations = new Map()
  for (const [, name, value] of match[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    declarations.set(name, value.trim())
  }
  return declarations
}

const base = rule(':root')
const kraft = rule('[data-plop-surface=kraft]')

/** A token, with one level of `var()` resolved across the two blocks. */
const token = (name) => {
  const value = base.get(name) ?? kraft.get(name)
  if (!value) throw new Error(`contrast: unknown token ${name}`)
  const reference = value.match(/^var\((--[a-z0-9-]+)\)$/)
  if (reference) return token(reference[1])
  if (!/^#[0-9a-f]{3,8}$/i.test(value)) {
    throw new Error(`contrast: ${name} is "${value}", which this gate cannot measure`)
  }
  return value
}

/**
 * `which` is the rule the pair comes from, so a failure points at the CSS to
 * change. `floor` is 4.5 for body and small text (13px captions included) and
 * 3.0 for type that is large in WCAG's sense — nothing here is that large yet.
 */
const pairs = [
  // The kraft surface, in the reader's own mode.
  { which: 'body text on the surface', fg: '--plop-on-l', bg: '--plop-bg-l', floor: 4.5 },
  { which: 'body text on the surface (dark)', fg: '--plop-on-d', bg: '--plop-bg-d', floor: 4.5 },
  // `.sheet`: paper in both modes, so its ink is pinned to the light half.
  { which: '.sheet text', fg: '--plop-ink', bg: '--plop-sheet', floor: 4.5 },
  { which: '.meta / .timeline .address in a sheet', fg: '--plop-ink', bg: '--plop-sheet', floor: 4.5 },
  { which: '.prose a', fg: '--plop-ink-text', bg: '--plop-sheet', floor: 4.5 },
  { which: '.prose blockquote', fg: '--plop-ink-soft', bg: '--plop-sheet', floor: 4.5 },
  { which: '.prose code / pre', fg: '--plop-ink', bg: '--plop-track', floor: 4.5 },
  // The rail's current-page chip, which does not change with the mode.
  { which: 'rail [aria-current=page]', fg: '--plop-on-fill-periwinkle', bg: '--plop-fill-periwinkle', floor: 4.5 },
]

let failures = 0
let worst = { ratio: Infinity, which: '' }

for (const pair of pairs) {
  const [fg, bg] = [token(pair.fg), token(pair.bg)]
  const ratio = contrast(fg, bg)
  if (ratio < worst.ratio) worst = { ratio, which: pair.which }
  if (ratio < pair.floor) {
    failures += 1
    console.error(
      `contrast: ${pair.which} is ${ratio.toFixed(2)}:1 (${fg} on ${bg}), below its floor of ${pair.floor}`,
    )
  }
}

/**
 * The numbers above only hold while the CSS keeps its two halves apart: a
 * light-only paper must pin light ink, and the surface's soft ink is too weak
 * for small type. Each requirement is one deleted line away from failing
 * silently, so they are checked as declarations rather than trusted as
 * intentions.
 */
const site = readFileSync('src/index.css', 'utf8')

const structure = [
  {
    rule: '.sheet',
    requires: ['--plop-on:', '--plop-on-soft:', 'color-scheme: light'],
    why: 'its paper is light only, so its ink has to be pinned to the light half',
  },
  {
    rule: '.meta',
    requires: ['var(--plop-on)'],
    why: '--plop-on-soft is 3.25:1 on light kraft, below AA for 13px text',
  },
  {
    rule: '.timeline .address',
    requires: ['var(--plop-on)'],
    why: 'it sits on the surface at 12.5px, where --plop-on-soft is 3.25:1',
  },
]

for (const check of structure) {
  const escaped = check.rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const found = site.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))
  if (!found) {
    failures += 1
    console.error(`contrast: src/index.css no longer has a \`${check.rule}\` rule to read`)
    continue
  }
  for (const requirement of check.requires) {
    if (!found[1].includes(requirement)) {
      failures += 1
      console.error(`contrast: ${check.rule} lost "${requirement}" — ${check.why}`)
    }
  }
}

if (failures) {
  console.error(`\ncontrast: ${failures} of ${pairs.length} pair(s) below the floor`)
  process.exit(1)
}

console.log(
  `contrast: ${pairs.length} pair(s) pass; the worst is ${worst.which} at ${worst.ratio.toFixed(2)}:1`,
)
