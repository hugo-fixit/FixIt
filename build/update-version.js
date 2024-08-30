import fs from 'fs';
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process';

// node build/update-version.js --stage [version/commit]
const stage = process.argv[3] || 'commit';
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const match = [
  'archetypes/',
  'assets/',
  'i18n/',
  'layouts/',
  'static/',
  'go.mod',
  'hugo.toml',
  'package.json',
  'package-lock.json',
  'theme.toml',
];
const gitDiff = execSync('git diff --cached --name-only').toString().trim();

if (stage !== 'version') {
  // Avoid conflicts when creating a Pull Request
  if (!['dev', 'master'].includes(branch)) {
    console.log(`The current branch is ${branch}, no need to update the FixIt version.`);
    process.exit(0);
  }
  if (!match.some((item) => gitDiff.includes(item))) {
    console.log('No need to update the FixIt version.');
    process.exit(0);
  }
}

const __root = join(dirname(fileURLToPath(import.meta.url)), '../');
const initHtmlPath = join(__root, 'layouts/partials/init/index.html');
const packageJsonPath = join(__root, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;
// Get the short hash of the last commit (can not get this commit hash at pre-commit hook)
const shortHash = execSync('git rev-parse --short HEAD').toString().trim();
// Build the development version v{major}.{minor}.{patch+1}-{shortHash}
const devVersion = `${version.replace(/(\d+)$/, (match, part) => parseInt(part) + 1)}-${shortHash}`;
const initHtml = fs.readFileSync(initHtmlPath, 'utf8');
const latestVersion = stage === 'version' ? version : devVersion;
const lastVersion = initHtml.match(/v\d+\.\d+\.\d+(-\w+)?/)[0].slice(1);
const newInitHtml = initHtml.replace(/v\d+\.\d+\.\d+(-\w+)?/, `v${latestVersion}`);

if (lastVersion === version && gitDiff.includes('layouts/partials/init/index.html')) {
  // After running `npm version` or manually modifying the version number, skip the update
  console.log(`The FixIt version has been updated to v${lastVersion}.`);
  process.exit(0);
}

// Update the version number in layouts/partials/init/index.html
fs.writeFileSync(initHtmlPath, newInitHtml);
// Add the updated files to the git stage
execSync('git add layouts/partials/init/index.html package.json package-lock.json');
console.log(`Update the FixIt version from v${lastVersion} to v${latestVersion}.`);

export default latestVersion;
