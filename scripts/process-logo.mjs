import sharp from "sharp";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const input = join(root, "public", "logo-source.png");
const output = join(root, "public", "logo.png");
const icon = join(root, "src", "app", "icon.png");

const image = sharp(input).ensureAlpha();
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += info.channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const isWhite = r > 228 && g > 228 && b > 228;
  const isPale = max > 210 && max - min < 18;

  if (isWhite || isPale) {
    data[i + 3] = 0;
  }
}

const transparent = sharp(data, {
  raw: { width: info.width, height: info.height, channels: info.channels },
});

await transparent.clone().png().toFile(output);
await transparent.clone().resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(icon);

console.log(`Wrote ${output} and ${icon} (${info.width}x${info.height})`);
