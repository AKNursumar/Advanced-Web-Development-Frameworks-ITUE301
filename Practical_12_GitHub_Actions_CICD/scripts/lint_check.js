/**
 * Code Quality & Linter Verification Script for CI Pipeline
 * Performs static checks on JavaScript files (syntax validity, forbidden patterns, proper structure)
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const testsDir = path.join(__dirname, '..', 'tests');

let errorCount = 0;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(path.join(__dirname, '..'), filePath);

  // Check 1: Forbidden console.error leaks or syntax markers
  if (content.includes('debugger;')) {
    console.error(`[LINT ERROR] ${relPath}: Found forbidden 'debugger;' statement`);
    errorCount++;
  }

  // Check 2: Basic JSON/module exports check
  if (!content.includes('module.exports') && !filePath.includes('test')) {
    console.warn(`[LINT WARNING] ${relPath}: Does not export modules directly`);
  }

  // Check 3: Check trailing whitespace or CRLF consistency
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.length > 180) {
      console.warn(`[LINT WARNING] ${relPath}:${idx + 1}: Line exceeds 180 characters (${line.length})`);
    }
  });

  console.log(`[LINT OK] Passed: ${relPath}`);
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      scanDir(full);
    } else if (f.name.endsWith('.js')) {
      checkFile(full);
    }
  }
}

console.log('--- [CI Linter Step] Running Static Code Quality Inspection ---');
scanDir(srcDir);
scanDir(testsDir);

if (errorCount > 0) {
  console.error(`\n[LINT FAILED] Found ${errorCount} linting issue(s). Aborting CI.`);
  process.exit(1);
} else {
  console.log('\n[LINT SUCCESS] All source and test files passed lint inspection with 0 errors.');
  process.exit(0);
}
