#!/usr/bin/env node
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const inputPath = join(projectRoot, 'public/proxe/demo-poster.png');
const outputPath = join(projectRoot, 'public/proxe/demo-poster.webp');

async function convertPoster() {
  console.log('Converting demo-poster.png to WebP...');
  console.log(`Input: ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  
  const info = await sharp(inputPath)
    .webp({ quality: 85, effort: 6 })
    .toFile(outputPath);
  
  const inputSize = (await import('fs')).statSync(inputPath).size;
  const outputSize = info.size;
  const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
  
  console.log(`\nConversion complete!`);
  console.log(`Original PNG: ${(inputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP output: ${(outputSize / 1024).toFixed(1)} KB`);
  console.log(`Reduction: ${reduction}%`);
  console.log(`Dimensions: ${info.width}×${info.height}`);
}

convertPoster().catch(err => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
