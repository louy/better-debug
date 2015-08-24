# Better Debug
[![Circle CI](https://img.shields.io/circleci/project/louy/better-debug.svg)](https://circleci.com/gh/louy/better-debug)
[![NPM](https://img.shields.io/npm/v/better-debug.svg)](https://www.npmjs.com/package/better-debug)
[![Codecov](https://img.shields.io/codecov/c/github/louy/better-debug.svg)](https://codecov.io/github/louy/better-debug/)

A better alternative to `debug` module.

## Installation

With npm...

`npm install --save better-debug`

## Usage

    var debug = require('better-debug')('main');

    debug.log('Test'); // app:main:log Test
    debug.info('Test %d', 0); // app:main:info Test 0
    debug.warn(new Error('Test')); // { [Error: Test] domain: 'main' }
    debug.error(new Error('Test'), { method: 'testMethod', 'location': 'index.js', }); // { [Error: Test] domain: 'main', meta: { method: 'testMethod', location: 'index.js' } }

You can filter info/log calls with the env variable `DEBUG`.
For example, `DEBUG=app:*:info node .` will only output `debug.info` calls.
