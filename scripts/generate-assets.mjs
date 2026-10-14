// Genera los iconos y la imagen para redes sociales a partir de SVG.
// Uso: node scripts/generate-assets.mjs   (se ejecuta una vez; los PNG se versionan)
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

const primary = '#0d5c56';
const logo = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${primary}"/>
  <path d="M7 15.5 16 8l9 7.5V24a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="m12 18 3 3 5.5-6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7f6f2"/><stop offset="1" stop-color="#e3f1ee"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="590" width="1200" height="40" fill="${primary}"/>
  <g transform="translate(90 110) scale(3.4)">
    <rect width="32" height="32" rx="7" fill="${primary}"/>
    <path d="M7 15.5 16 8l9 7.5V24a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="m12 18 3 3 5.5-6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="225" y="190" font-family="DejaVu Sans, Arial, sans-serif" font-size="52" font-weight="700" fill="#1d2422">Alquiler en Regla</text>
  <text x="90" y="330" font-family="DejaVu Sans, Arial, sans-serif" font-size="58" font-weight="700" fill="#1d2422">Calcula y entiende tu alquiler</text>
  <text x="90" y="410" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" fill="#4a5552">Actualización de la renta, fianza, preaviso y prórrogas</text>
  <text x="90" y="460" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" fill="#4a5552">con la normativa española citada y fechada.</text>
</svg>`;

/** Envuelve un PNG en un contenedor ICO (formato admitido desde Windows Vista). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(6 + 16, 12);
  return Buffer.concat([header, entry, png]);
}

await mkdir('public/og', { recursive: true });
await writeFile('public/favicon.svg', logo(32));
const fav = await sharp(Buffer.from(logo(256))).resize(32, 32).png().toBuffer();
await writeFile('public/favicon.ico', pngToIco(fav, 32));
await sharp(Buffer.from(logo(512))).resize(180, 180).flatten({ background: primary }).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og/default.png');
console.log('Iconos e imagen OG generados en public/.');
