#!/usr/bin/env node
/**
 * ng-packagr strips "scripts" (including postinstall) and
 * "devDependencies" from the built package.json for security reasons.
 * This runs after `ng-packagr build` to:
 *   1. Copy bin/init-theme.js into the dist package
 *   2. Re-add the postinstall hook to dist/package.json
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', '..', 'dist', 'ng-ui-kit');
const srcBin = path.join(__dirname, '..', 'bin', 'init-theme.js');
const destBinDir = path.join(distDir, 'bin');
const destBin = path.join(destBinDir, 'init-theme.js');
const pkgPath = path.join(distDir, 'package.json');

if (!fs.existsSync(distDir)) {
  console.error('prepare-dist: dist folder not found, did ng-packagr run first?');
  process.exit(1);
}

fs.mkdirSync(destBinDir, { recursive: true });
fs.copyFileSync(srcBin, destBin);
fs.chmodSync(destBin, 0o755);

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = { postinstall: 'node ./bin/init-theme.js' };
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log('prepare-dist: copied bin/init-theme.js and restored postinstall hook in dist/package.json');
