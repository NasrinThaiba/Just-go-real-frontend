import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "src/ads";
const outputDir = "src/ads/optimized";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs
  .readdirSync(inputDir)
  .filter((file) => /\.(png|jpg|jpeg)$/i.test(file));

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const fileName = path.parse(file).name;
  const outputPath = path.join(outputDir, `${fileName}.webp`);

  await sharp(inputPath)
    .resize({
      width: 1200,
      withoutEnlargement: true,
    })
    .webp({
      quality: 75,
      effort: 6,
    })
    .toFile(outputPath);

  console.log(`Optimized: ${file} → ${fileName}.webp`);
}