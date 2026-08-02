/**
 * Generates the brand mark and every raster icon referenced by
 * site.webmanifest and BaseHead.
 *
 * Run manually (`npm run icons`) and commit the output — the deploy build must
 * not depend on sharp or on system fonts being present in the CI container.
 *
 * The glyph is kept identical to `src/components/Logo.astro`. If you change one,
 * change the other: the favicon and the in-page mark must not drift apart.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = new URL('../public/', import.meta.url);
await mkdir(OUT, { recursive: true });

const GRADIENT_FROM = '#6366F1';
const GRADIENT_VIA = '#8B5CF6';
const GRADIENT_TO = '#D946EF';

/** The 32x32 glyph, without its background plate. */
const glyph = (gradientId) => `
  <g stroke="#fff" stroke-width="1.9" stroke-linecap="round" opacity="0.92">
    <path d="M10 9.5 16.5 16"/>
    <path d="M10 16h6.5"/>
    <path d="M10 22.5 16.5 16"/>
    <path d="M16.5 16H23"/>
  </g>
  <g fill="#fff">
    <circle cx="9.5" cy="9.5" r="2.2"/>
    <circle cx="9.5" cy="16" r="2.2"/>
    <circle cx="9.5" cy="22.5" r="2.2"/>
    <circle cx="23" cy="16" r="2.2"/>
  </g>
  <circle cx="16.5" cy="16" r="3.1" fill="#fff"/>
  <circle cx="16.5" cy="16" r="1.35" fill="url(#${gradientId})"/>`;

/**
 * A full icon at `size`, with `padding` of safe zone and `radius` corners.
 * `flat` fills with a solid colour instead of the gradient — used for the
 * maskable icon, where launchers may crop into the corners.
 */
const mark = (size, padding, radius, { flat = false } = {}) => {
  const id = 'g';
  const scale = (size - padding * 2) / 32;
  const fill = flat ? GRADIENT_VIA : `url(#${id})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GRADIENT_FROM}"/>
      <stop offset="55%" stop-color="${GRADIENT_VIA}"/>
      <stop offset="100%" stop-color="${GRADIENT_TO}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="${fill}"/>
  <g transform="translate(${padding} ${padding}) scale(${scale})">${glyph(id)}</g>
</svg>`;
};

const jobs = [
  // [filename, size, padding, cornerRadius, options]
  ['apple-touch-icon.png', 180, 20, 0, {}],
  ['icon-192.png', 192, 22, 44, {}],
  ['icon-512.png', 512, 58, 118, {}],
  // Maskable icons need ~20% safe-zone padding on all sides and must fill the
  // full square — launchers crop them to their own shape.
  ['icon-maskable-512.png', 512, 128, 0, { flat: true }],
  ['favicon-32.png', 32, 3, 7, {}],
  ['favicon-16.png', 16, 1, 4, {}],
];

for (const [name, size, padding, radius, options] of jobs) {
  const svg = Buffer.from(mark(size, padding, radius, options));
  await sharp(svg).png({ compressionLevel: 9 }).toFile(new URL(name, OUT).pathname);
  console.log('wrote', name, `${size}x${size}`);
}

// ---------------------------------------------------------------------------
// Vector assets. Written from the same source of truth as the rasters above.
// ---------------------------------------------------------------------------

await writeFile(new URL('favicon.svg', OUT), mark(32, 3, 7) + '\n');
console.log('wrote favicon.svg');

/** Wordmark used for Organization JSON-LD and social profile references. */
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="64" viewBox="0 0 320 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GRADIENT_FROM}"/>
      <stop offset="55%" stop-color="${GRADIENT_VIA}"/>
      <stop offset="100%" stop-color="${GRADIENT_TO}"/>
    </linearGradient>
  </defs>
  <rect x="4" y="12" width="40" height="40" rx="11" fill="url(#g)"/>
  <g transform="translate(9 17) scale(0.9375)">${glyph('g')}</g>
  <text x="58" y="41" font-family="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        font-size="27" font-weight="800" letter-spacing="-0.5">
    <tspan fill="#0F172A">AI</tspan><tspan fill="url(#g)">Insider</tspan>
  </text>
</svg>
`;
await writeFile(new URL('logo.svg', OUT), logo);
console.log('wrote logo.svg');
