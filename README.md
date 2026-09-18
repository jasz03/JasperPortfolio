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
