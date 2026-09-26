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

## SEO and the social preview card

`index.html` carries the canonical URL, meta description, Open Graph and Twitter
card tags, and JSON-LD `Person`/`WebSite` data. The canonical origin is
**https://jasper-portfolio-puce.vercel.app** and it is hard-coded in three
places — change them together when the domain changes:

- `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD)
- `public/robots.txt` (the `Sitemap:` line)
- `public/sitemap.xml` (the `<loc>` entry)

`public/og-image.png` is the 1200×630 card that link previews show. It is
**committed on purpose**, because the deploy build runs Node only and has no
image tooling. Regenerate it after changing the card copy or the colour tokens in
`src/styles.css`:

```bash
pip install pillow
python scripts/generate_og_image.py
```

`npm run build` fails if that PNG is missing, so the `og:image` tag can never
ship pointing at a 404.

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
