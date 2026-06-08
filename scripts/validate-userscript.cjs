const fs = require('fs');
const path = require('path');
const {
  SCRIPT_NAME,
  SEMVER,
  getGreasyForkHeaders,
  getPerformanceHeaders,
} = require('../userscript.metadata.cjs');

const DIST_DIR = path.join(__dirname, '..', 'dist');

const artifacts = [
  {
    label: 'performance',
    file: 'wtr-lab-novel-image-generator.user.js',
    metaFile: 'wtr-lab-novel-image-generator.meta.js',
    headers: getPerformanceHeaders(),
    requireUpdateUrls: true,
  },
  {
    label: 'greasyfork',
    file: 'wtr-lab-novel-image-generator.greasyfork.user.js',
    metaFile: 'wtr-lab-novel-image-generator.greasyfork.meta.js',
    headers: getGreasyForkHeaders(),
    requireUpdateUrls: false,
  },
];

function readArtifact(fileName) {
  const filePath = path.join(DIST_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required dist artifact: dist/${fileName}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function extractHeader(content, fileName) {
  const match = content.match(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/);

  if (!match) {
    throw new Error(`Missing userscript metadata header in dist/${fileName}`);
  }

  return match[0];
}

function assertHeaderField(header, key, value, fileName) {
  const values = Array.isArray(value) ? value : [value];

  for (const expected of values) {
    const escaped = String(expected).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^// @${key}\\s+${escaped}$`, 'm');

    if (!pattern.test(header)) {
      throw new Error(`Missing metadata field in dist/${fileName}: @${key} ${expected}`);
    }
  }
}

function assertNoHeaderField(header, key, fileName) {
  const pattern = new RegExp(`^// @${key}\\s+`, 'm');

  if (pattern.test(header)) {
    throw new Error(`Unexpected metadata field in dist/${fileName}: @${key}`);
  }
}

function validateArtifact(artifact) {
  const script = readArtifact(artifact.file);
  const meta = readArtifact(artifact.metaFile);
  const scriptHeader = extractHeader(script, artifact.file);
  const metaHeader = extractHeader(meta, artifact.metaFile);

  for (const [key, value] of Object.entries(artifact.headers)) {
    assertHeaderField(scriptHeader, key, value, artifact.file);
    assertHeaderField(metaHeader, key, value, artifact.metaFile);
  }

  if (artifact.requireUpdateUrls) {
    assertHeaderField(scriptHeader, 'downloadURL', artifact.headers.downloadURL, artifact.file);
    assertHeaderField(scriptHeader, 'updateURL', artifact.headers.updateURL, artifact.file);
  } else {
    assertNoHeaderField(scriptHeader, 'downloadURL', artifact.file);
    assertNoHeaderField(scriptHeader, 'updateURL', artifact.file);
    assertNoHeaderField(metaHeader, 'downloadURL', artifact.metaFile);
    assertNoHeaderField(metaHeader, 'updateURL', artifact.metaFile);
  }

  console.log(
    `Validated ${artifact.label} userscript metadata version ${artifact.headers.version} in dist/${artifact.file}.`
  );
}

for (const artifact of artifacts) {
  validateArtifact(artifact);
}

console.log(`Validated ${SCRIPT_NAME} public artifact names and metadata version ${SEMVER}.`);
