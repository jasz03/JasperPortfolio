# Leo Jasper V. Ladica — IT Portfolio

A responsive React + Vite portfolio featuring:

- React frontend
- Vite build system
- ThreeUI animated WebGL background
- Responsive layout
- Dark/light theme support

## Run locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the built output locally
```

`dist/` is generated output and is **not committed** — it is ignored in
`.gitignore`. Vercel builds it from source on every deploy, and the CI workflow
(`.github/workflows/ci.yml`) builds it on every push.

## Fonts

Inter and JetBrains Mono are **self-hosted** from `public/fonts/` (latin subset,
variable weight axis) and declared with `@font-face` at the top of
`src/styles.css`. Nothing is fetched from a font CDN, so the typography looks the
same on devices that have neither font installed. `index.html` preloads both
files so text does not swap after first paint.

To update a font, replace the `.woff2` in `public/fonts/` — either keeping the
filename or updating both the `@font-face` `src` and the preload links. The range
in `font-weight` must match the file's variable axis: Inter is 100–900, JetBrains
Mono is 100–800.

## Tech stack wall

The chip wall at the top of the Skills section is the **single place on the page
that names technologies**. `src/components/TechStack.jsx` holds the grouped list;
the seven skill cards below it describe how that work is actually done, which is
why they no longer repeat the names in tag rows. Only one tag row remains there —
the working-strengths card — because those are not technologies.

To add or remove a technology, edit the `GROUPS` array in `TechStack.jsx`.

### Icons

Logos live in `public/icons/`. Most are applied as CSS alpha masks, so a single
`currentColor` paints them and both themes work with no per-icon CSS and no
light/dark asset variants. Two are shown instead — see **Two render modes** below.

Most icons are **unmodified Simple Icons SVGs** (CC0). The rest were added by hand
because Simple Icons has no such glyph: `aws`, `windows` and `chatgpt` from other
sources, `microsoftword` and `microsoftexcel` as greyscale re-colours of the
official Microsoft marks, and `sql` and `canva` (both modified, see below).

### Two render modes

Masking is the default, but it cannot show every mark. `microsoftword` and
`microsoftexcel` are **shown** instead of masked: their letters are painted
opaquely on top of the artwork, so an alpha mask flattens the whole logo into a
solid block and the letter vanishes. Those two entries carry `asImage: true` in
`TechStack.jsx`, which paints the file in `.tech-chip-icon.as-image`:

- `filter: grayscale(1)` keeps them in the wall's greyscale palette whatever the
  file contains, so a coloured export still renders grey.
- `[data-theme="dark"]` adds `invert(1)`, so the dark artwork reads as a light
  figure on the dark chip, the same way the masked icons do. Without it the mark
  disappears into the background in dark mode.

To go back to the mask treatment for one of them, drop its `asImage: true` — but
expect a solid block, not a letter, because the letter is opaque.

**`sql` and `canva` are modified vendor downloads.** Both paint their detail in
white (or an opaque light gradient) on top of coloured shapes, so each carries a
hand-added `<mask id="knockout">` that re-declares the glyph in black, punching
it out as a transparent hole. There is a comment in each file explaining this at
the point that matters. If you drop in a fresh download of either, redo the
knockout or it will render as a plain square.

Brand marks belong to their respective owners.

To add one, drop the SVG into `public/icons/` and reference its filename without
the extension (`{ name: 'Redis', icon: 'redis' }`), or download it from
<https://simpleicons.org> using its slug.

**Entries with no icon are intentional, not broken.** Five have no usable mark:
Active Directory, Office 365 and Freebuff are absent from Simple Icons (verified
absent: `activedirectory`, `microsoftwindows`, `microsoftoffice`, `openai`), and
Endpoint & Hardware and Network Monitoring are concepts with no product mark at
all. Those render as text chips in the same shell, so the wall still reads as one
system. Masks are also hidden in print, since masked logos do not render reliably
on paper.

## SEO and the social preview card

`index.html` carries the canonical URL, meta description, Open Graph and Twitter
card tags, and JSON-LD `Person`/`WebSite` data. Its `knowsAbout` list mirrors the
tech stack wall — update it alongside `TechStack.jsx` when the stack changes. The canonical origin is
**https://jasperladica.vercel.app** and it is hard-coded in four places — change
them together when the domain changes, or crawlers and link previews will point
at a domain that does not serve the site:

- `index.html` (canonical, `og:url`, `twitter:url`, `og:image`, `twitter:image`, JSON-LD)
- `public/robots.txt` (the `Sitemap:` line)
- `public/sitemap.xml` (the `<loc>` entry)
- `scripts/generate_og_image.py` (`SITE`) — the domain is drawn **into the card
  image**, so the PNG has to be regenerated, not just re-tagged

`public/og-image.png` is the 1200×630 card that link previews show. It is
**committed on purpose**, because the deploy build runs Node only and has no
image tooling. Regenerate it after changing the card copy, the `SITE` value, or
the colour tokens in `src/styles.css`:

```bash
pip install pillow
python scripts/generate_og_image.py
```

`npm run build` fails if that PNG is missing, so the `og:image` tag can never
ship pointing at a 404.

`public/sitemap.xml` deliberately carries **no `lastmod`**: it is a single static
page, and the date that used to be hardcoded there only ever aged into a wrong
freshness signal. Search engines ignore `lastmod` they cannot trust, so omitting
it is more honest than guessing. If the site ever grows multiple pages, generate
the sitemap at build time instead of hand-writing dates.

## Images

Project screenshots live in `public/images/` as **WebP**, and `public/apple-touch-icon.png`
is committed alongside the SVG favicon. Both are produced by one script:

```bash
python scripts/prepare_images.py
```

- **Screenshots.** The four UI captures are the largest part of the page weight;
  at quality 90 WebP takes them from ~1.0 MB to ~165 kB with no visible change on
  flat UI colours and small text. The HTML references the `.webp` files directly
  — no PNG fallback is committed, because WebP is supported by every browser this
  site targets and a fallback would double the repo for a file nobody requests.
  The script skips any screenshot whose source PNG has already been converted, so
  re-running it is safe. Do not compress the logo SVGs in `public/icons/`: they are
  masks and measure in single-digit kB already.
- **Apple touch icon.** iOS ignores SVG favicons and shows a page screenshot
  instead. The mark is redrawn at 180×180, full-bleed and without transparency,
  because iOS applies its own corner mask and transparent corners surface as
  black.

The captions on the screenshots carry the project and stack they show, so the alt
text describes the work rather than the file.

## Reduced motion

The site honours `prefers-reduced-motion`. CSS handles the fades and slides, and
`src/components/ShaderBackground.jsx` unmounts the WebGL background entirely when
the preference is set, rendering the static `.shader-static` gradient from
`styles.css` instead. Unmounting matters: hiding the canvas with CSS would leave
its render loop running and still cost CPU and battery. The preference is watched
live, so toggling it in the OS updates the page without a reload.

## Updating the résumé

**Replace one file: `public/Leo_Jasper_Ladica_Resume.pdf`.**

That copy is the single source of truth. `npm run build` copies it into `dist/`,
and that is what the deployed site serves.

Do **not** edit `dist/Leo_Jasper_Ladica_Resume.pdf` by hand — `dist/` is generated
output. Any change made there is overwritten the next time the project is built,
which is exactly how an "updated" résumé ends up invisible on the live site.

The app links to the résumé with a hash of the PDF's contents appended to the URL
(`/Leo_Jasper_Ladica_Resume.pdf?v=…`, generated in `vite.config.js`). Replacing the
PDF changes that URL, so browsers and the CDN cannot keep serving an older copy.
A missing PDF fails the build instead of shipping a broken link.
