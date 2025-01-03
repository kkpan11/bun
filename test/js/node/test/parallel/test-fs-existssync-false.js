'use strict';
const common = require('../common');
if (common.isWindows) return; // TODO: BUN
const tmpdir = require('../common/tmpdir');

// This test ensures that fs.existsSync doesn't incorrectly return false.
// (especially on Windows)
// https://github.com/nodejs/node-v0.x-archive/issues/3739

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let dir = path.resolve(tmpdir.path);

// Make sure that the tmp directory is clean
tmpdir.refresh();

// Make a long path.
for (let i = 0; i < 50; i++) {
  dir = `${dir}/1234567890`;
  try {
    fs.mkdirSync(dir, '0777');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}

// Test if file exists synchronously
assert(fs.existsSync(dir), 'Directory is not accessible');

// Test if file exists asynchronously
fs.access(dir, common.mustSucceed());
