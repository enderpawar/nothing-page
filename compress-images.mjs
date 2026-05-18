import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const tasks = [
  { src: 'public/crew-night-room.png', out: 'public/crew-night-room.webp', maxW: 1600, quality: 78 },
  { src: 'public/games/valorant.jpg', out: 'public/games/valorant.webp', maxW: 900, quality: 78 },
  { src: 'public/games/league.jpg', out: 'public/games/league.webp', maxW: 900, quality: 78 },
  { src: 'public/games/minecraft.png', out: 'public/games/minecraft.webp', maxW: 900, quality: 78 },
  { src: 'public/games/overwatch.png', out: 'public/games/overwatch.webp', maxW: 900, quality: 78 },
  { src: 'public/games/lethal-company.jpg', out: 'public/games/lethal-company.webp', maxW: 900, quality: 78 }
];

for (const t of tasks) {
  const before = (await fs.stat(t.src)).size;
  await sharp(t.src)
    .resize({ width: t.maxW, withoutEnlargement: true })
    .webp({ quality: t.quality, effort: 5 })
    .toFile(t.out);
  const after = (await fs.stat(t.out)).size;
  const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
  console.log(`${path.basename(t.src)} → ${path.basename(t.out)}  ${kb(before)} → ${kb(after)}  (-${Math.round((1 - after / before) * 100)}%)`);
}
