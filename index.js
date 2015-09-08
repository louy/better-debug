var debug = require('debug');
var util = require('util'),
    extend = util._extend;
var colors = require('colors');
var EventEmitter = require('events').EventEmitter;

colors.setTheme({
  help: 'cyan',
  data: 'grey',

  log: 'blue',
  info: 'green',
  warn: 'yellow',
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

  var r = {};
  var levels = ['log', 'info', 'warn', 'error'];

  levels.forEach(function(level) {
    var d = debug(['app', domain, level].join(':'));

    if ('undefined' !== typeof console[level]) {
      d.log = function() {
        return console[level].apply(console, arguments);
      };
    }

    var fn = function(msg) {
      if (!msg) { return; } // Skip empty messages.
      if (msg instanceof Error) {
        var err = errorify.apply(this, arguments);
        d.apply(null, [util.inspect(err)[level], err.stack.data]);
      } else {
        d.apply(null, arguments);
      }

      try {
        ee.emit(level, arguments);
      } catch (e) {}
    };

    r[level] = fn;
  });

  r.ifError = r.error; // Backwards compatibility.

  return r;
};

module.exports.addListener = ee.addListener.bind(ee);
module.exports.on = ee.on.bind(ee);
module.exports.once = ee.once.bind(ee);
module.exports.removeListener = ee.removeListener.bind(ee);
module.exports.removeAllListeners = ee.removeAllListeners.bind(ee);
module.exports.listeners = ee.listeners.bind(ee);
