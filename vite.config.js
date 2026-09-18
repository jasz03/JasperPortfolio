import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
