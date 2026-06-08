const pkg = require('./package.json');
const { VERSION_INFO } = require('./config/versions.js');

const SCRIPT_NAME = 'WTR LAB Novel Image Generator';
const PACKAGE_NAME = pkg.name || 'wtr-lab-novel-image-generator';
const SEMVER = VERSION_INFO && VERSION_INFO.SEMANTIC ? VERSION_INFO.SEMANTIC : pkg.version || '0.0.0';

const COMMON_HEADERS = {
  description: pkg.description,
  author: pkg.author,
  supportURL: pkg.bugs && pkg.bugs.url,
  license: pkg.license,
  namespace: 'http://tampermonkey.net/',
  match: 'https://wtr-lab.com/en/novel/*/*/*',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com',
  connect: '*',
  grant: [
    'GM_setValue',
    'GM_getValue',
    'GM_xmlhttpRequest',
    'GM_registerMenuCommand',
  ],
};

function getDevHeaders() {
  return {
    ...COMMON_HEADERS,
    name: `${SCRIPT_NAME} [DEV]`,
    version: `${SEMVER}-dev.[buildTime]`,
  };
}

function getPerformanceHeaders() {
  return {
    ...COMMON_HEADERS,
    name: SCRIPT_NAME,
    version: SEMVER,
    downloadURL:
      'https://update.greasyfork.org/scripts/553073/WTR%20LAB%20Novel%20Image%20Generator.user.js',
    updateURL:
      'https://update.greasyfork.org/scripts/553073/WTR%20LAB%20Novel%20Image%20Generator.meta.js',
  };
}

function getGreasyForkHeaders() {
  return {
    ...COMMON_HEADERS,
    name: SCRIPT_NAME,
    version: SEMVER,
  };
}

module.exports = {
  COMMON_HEADERS,
  PACKAGE_NAME,
  SCRIPT_NAME,
  SEMVER,
  getDevHeaders,
  getGreasyForkHeaders,
  getPerformanceHeaders,
};
