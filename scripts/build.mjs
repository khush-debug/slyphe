/**
 * CELESTIA — TypeScript Build & Asset Assembler
 * Compiles TypeScript source files into clean ES modules using Node's native stripTypeScriptTypes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const srcDir = path.join(rootDir, 'src');
const jsOutDir = path.join(rootDir, 'js');
const distDir = path.join(rootDir, 'dist');
const distJsDir = path.join(distDir, 'js');

console.log('✨ Building CELESTIA with TypeScript...');

// Ensure output directories exist
fs.mkdirSync(jsOutDir, { recursive: true });
fs.mkdirSync(distJsDir, { recursive: true });

// 1. Compile TypeScript files in src/
let stripFn = null;
try {
  const mod = await import('node:module');
  if (typeof mod.stripTypeScriptTypes === 'function') {
    stripFn = mod.stripTypeScriptTypes;
  }
} catch {
  // Not supported or experimental
}

if (fs.existsSync(srcDir)) {
  const tsFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts'));

  for (const file of tsFiles) {
    const filePath = path.join(srcDir, file);
    const tsCode = fs.readFileSync(filePath, 'utf8');
    const outFile = file.replace(/\.ts$/, '.js');

    if (stripFn) {
      try {
        let jsCode = stripFn(tsCode);
        jsCode = jsCode.replace(/from\s+['"]\.\/([^'"]+)\.ts['"]/g, "from './$1.js'");
        fs.writeFileSync(path.join(jsOutDir, outFile), jsCode, 'utf8');
        fs.writeFileSync(path.join(distJsDir, outFile), jsCode, 'utf8');
        console.log(`  ✓ Compiled src/${file} -> js/${outFile}`);
        continue;
      } catch (err) {
        console.warn(`  ! Could not strip types for ${file}:`, err.message);
      }
    }

    // Fallback: If pre-compiled file exists in js/, copy it
    const existingJs = path.join(jsOutDir, outFile);
    if (fs.existsSync(existingJs)) {
      fs.copyFileSync(existingJs, path.join(distJsDir, outFile));
      console.log(`  ✓ Synced pre-built js/${outFile} -> dist/js/${outFile}`);
    }
  }
}

// 2. Copy root HTML and CSS files to dist/
const rootFilesToCopy = [
  'index.html',
  'clothing.html',
  'fragrance.html',
  'journal.html',
  '404.html',
  'style.css',
  'vercel.json'
];

for (const file of rootFilesToCopy) {
  const src = path.join(rootDir, file);
  const dst = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
  }
}

// 3. Copy public/ directory to dist/public/
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(path.join(rootDir, 'public'), path.join(distDir, 'public'));

console.log('✅ Build complete! Assets assembled in dist/ and js/');
