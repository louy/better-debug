# Better Debug
[![Circle CI](https://img.shields.io/circleci/project/louy/better-debug.svg)](https://circleci.com/gh/louy/better-debug)
[![npm](https://img.shields.io/npm/v/better-debug.svg)](https://www.npmjs.com/package/better-debug)
[![npm](https://img.shields.io/npm/l/better-debug.svg)](https://www.npmjs.com/package/better-debug)
[![Codacy](https://img.shields.io/codacy/45ea0dd6e3c944a99d0b671319ade52b.svg)](https://www.codacy.com/app/louy/better-debug)
[![Codecov](https://img.shields.io/codecov/c/github/louy/better-debug.svg)](https://codecov.io/github/louy/better-debug/)
[![VersionEye](https://img.shields.io/versioneye/d/nodejs/better-debug.svg)](https://www.versioneye.com/nodejs/better-debug/)

A better alternative to `debug` module.

## Installation

With npm...

`npm install --save better-debug`

## Usage

    var debug = require('better-debug')('main');

    debug.log('Test'); // app:main:log Test
    debug.info('Test %d', 0); // app:main:info Test 0
    debug.warn(new Error('Test')); // app:main:warn { [Error: Test] }
    debug.error(new Error('Test'), { method: 'testMethod', 'location': 'index.js', }); // app:main:error { [Error: Test] method: 'testMethod', location: 'index.js' }

You can filter everything with the env variable `DEBUG`.
For example, `DEBUG=app:*:info node .` will only output `debug.info` calls.
