var debug = require('debug');
var util = require('util'),
    extend = util._extend;
var colors = require('colors');
var EventEmitter = require('events').EventEmitter;

colors.setTheme({
  data: 'grey',
  info: 'green',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

var ee = new EventEmitter();

function errorify(err) {
  err = typeof err === 'object' ? err : new Error(err);
  err.meta = err.meta || {};

  [].forEach.call(arguments, function(argument, index) {
    if (index === 0) { return; }

    if (typeof argument === 'object') {
      extend(err.meta, argument);
    }
  });

  return err;
}

module.exports = function(domain) {

  var log   = (function(fn) {
    return function() {
      fn.apply(null, arguments);
      ee.emit.apply(ee, ['log'].concat(arguments));
    };
  })(debug(['app', domain, 'log'].join(':')));

  var info  = (function(fn) {
    return function() {
      fn.apply(null, arguments);
      ee.emit.apply(ee, ['info'].concat(arguments));
    };
  })(debug(['app', domain, 'info'].join(':')));

  var error = function() {
    var err = errorify.apply(this, arguments);
    err.domain = domain;
    console.error('%s'.error + '\n%s'.data, util.inspect(err), err.stack);
    try {
      ee.emit('error', err);
    } catch (e) {}
  };

  var warn = function() {
    var err = errorify.apply(this, arguments);
    err.domain = domain;
    console.warn('%s'.warn + '\n%s'.data, util.inspect(err), err.stack);
    ee.emit('warn', err);
  };

  return {
    log: log,
    info: info,
    warn: warn,
    error: error,

    // Use this function if you don't want to pass the error upwards.
    ifError: function(err) {
      if (err) {
        return error.apply(this, arguments);
      }
    },
  };
};

module.exports.addListener = ee.addListener.bind(ee);
module.exports.on = ee.on.bind(ee);
module.exports.once = ee.once.bind(ee);
module.exports.removeListener = ee.removeListener.bind(ee);
module.exports.removeAllListeners = ee.removeAllListeners.bind(ee);
module.exports.listeners = ee.listeners.bind(ee);
