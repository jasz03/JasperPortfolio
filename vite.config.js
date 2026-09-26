import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The résumé is served from public/ under a stable URL so it stays shareable.
// To stop browsers and the CDN handing out an outdated copy after the PDF is
// replaced, the app appends a hash of the file's contents to that URL.
const resumePath = fileURLToPath(
  new URL('./public/Leo_Jasper_Ladica_Resume.pdf', import.meta.url)
);

let resumeVersion;
try {
  resumeVersion = createHash('sha256')
    .update(readFileSync(resumePath))
    .digest('hex')
    .slice(0, 12);
} catch {
  throw new Error(
    `Résumé PDF not found at public/Leo_Jasper_Ladica_Resume.pdf — the build cannot produce a working résumé link.`
  );
}

// The social preview card is committed rather than generated during the build:
// this build runs Node only and has no Python/Pillow. Verify it exists so the
// og:image meta tag can never ship pointing at a 404.
const ogImagePath = fileURLToPath(new URL('./public/og-image.png', import.meta.url));
if (!existsSync(ogImagePath)) {
  throw new Error(
    'Social preview image not found at public/og-image.png — regenerate it with `python scripts/generate_og_image.py`.'
  );
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    // threeui ships against its own three build; dedupe so only one copy loads
    dedupe: ['three'],
  },
  define: {
    __RESUME_VERSION__: JSON.stringify(resumeVersion),
  },
});
