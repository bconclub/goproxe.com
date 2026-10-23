#!/usr/bin/env node
/**
 * Blog cover pipeline. PNGs in public/blog/ stay the source of truth.
 * For every <slug>.png it writes:
 *   public/blog/<slug>.webp       1536x864, on-page hero + large cards
 *   public/blog/<slug>-768.webp   768x432, list thumbnails (srcset)
 *   public/blog/og/<slug>.jpg     1200x630, og:image + twitter:image
 * Plus public/blog/og/blog.jpg for the /blog index (from app/opengraph-image.jpg).
 *
 * Quality steps down until each file is under its budget.
 * Run after adding a cover:  node scripts/optimize-blog-images.cjs
 * Skips outputs newer than their source; pass --force to redo all.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const BLOG = path.join(ROOT, 'public', 'blog')
const OG = path.join(BLOG, 'og')
const FORCE = process.argv.includes('--force')

const KB = 1024
const TARGETS = [
  { suffix: '.webp', dir: BLOG, w: 1536, h: 864, fmt: 'webp', q: 80, max: 150 * KB },
  { suffix: '-768.webp', dir: BLOG, w: 768, h: 432, fmt: 'webp', q: 78, max: 60 * KB },
  { suffix: '.jpg', dir: OG, w: 1200, h: 630, fmt: 'jpeg', q: 82, max: 200 * KB },
]

async function encode(src, t) {
  for (let q = t.q; q >= 50; q -= 5) {
    const img = sharp(src).resize(t.w, t.h, { fit: 'cover', position: 'centre' })
    const buf =
      t.fmt === 'webp'
        ? await img.webp({ quality: q, effort: 6 }).toBuffer()
        : await img.jpeg({ quality: q, mozjpeg: true, progressive: true }).toBuffer()
    if (buf.length <= t.max || q - 5 < 50) return { buf, q }
  }
}

function fresh(out, src) {
  return !FORCE && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs
}

async function run(src, slug, targets) {
  const sizes = []
  for (const t of targets) {
    const out = path.join(t.dir, slug + t.suffix)
    if (fresh(out, src)) continue
    const { buf, q } = await encode(src, t)
    fs.writeFileSync(out, buf)
    sizes.push(`${t.suffix} ${(buf.length / KB).toFixed(0)}KB q${q}${buf.length > t.max ? ' OVER' : ''}`)
  }
  if (sizes.length) console.log(slug.padEnd(48), sizes.join(' | '))
}

;(async () => {
  fs.mkdirSync(OG, { recursive: true })
  const pngs = fs.readdirSync(BLOG).filter((f) => f.endsWith('.png'))
  for (const f of pngs) await run(path.join(BLOG, f), f.slice(0, -4), TARGETS)
  await run(path.join(ROOT, 'app', 'opengraph-image.jpg'), 'blog', [TARGETS[2]])
  console.log(`done: ${pngs.length} covers`)
})()
