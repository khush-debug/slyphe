/**
 * CELESTIA — TypeScript Build & Asset Assembler
 * Compiles TypeScript source files into clean ES modules using the TypeScript compiler API.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

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
if (fs.existsSync(srcDir)) {
  const tsFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts'));

  for (const file of tsFiles) {
    const filePath = path.join(srcDir, file);
    const tsCode = fs.readFileSync(filePath, 'utf8');
    const outFile = file.replace(/\.ts$/, '.js');

    try {
      const result = ts.transpileModule(tsCode, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          removeComments: false,
        },
      });

      let jsCode = result.outputText;
      // Ensure import paths reference .js for browser ESM
      jsCode = jsCode.replace(/from\s+['"]\.\/([^'"]+)\.ts['"]/g, "from './$1.js'");

      fs.writeFileSync(path.join(jsOutDir, outFile), jsCode, 'utf8');
      fs.writeFileSync(path.join(distJsDir, outFile), jsCode, 'utf8');
      console.log(`  ✓ Compiled src/${file} -> js/${outFile}`);
    } catch (err) {
      console.warn(`  ! Could not transpile ${file}:`, err.message);
    }
  }
}

// 2. Sync all bundled assets in js/ to dist/js/
if (fs.existsSync(jsOutDir)) {
  for (const f of fs.readdirSync(jsOutDir)) {
    fs.copyFileSync(path.join(jsOutDir, f), path.join(distJsDir, f));
  }
}

// 3. Copy root HTML and CSS files to dist/
const rootFilesToCopy = [
  'index.html',
  'clothing.html',
  'fragrance.html',
  'journal.html',
  'store.html',
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

// 4. Copy public/ directory to dist/public/
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
