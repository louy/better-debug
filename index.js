var debug = require('debug');
var util = require('util'),
    extend = util._extend;
var EventEmitter = require('events').EventEmitter;

var chalk = require('chalk');
var colors = {
  data: chalk.gray,

  log: chalk.bold.blue,
  info: chalk.bold.green,
  warn: chalk.bold.yellow,
  error: chalk.bold.red,
};

var ee = new EventEmitter();

function errorify(err) {
  err = typeof err === 'object' ? err : new Error(err);

  [].forEach.call(arguments, function(argument, index) {
    if (index === 0) { return; }

    if (typeof argument === 'object') {
      extend(err, argument);
    }
  });

  return err;
}

module.exports = function(domain, opts) {

  var r = {};
  var levels = ['log', 'info', 'warn', 'error'];

  var prefix = 'app:';
  if (opts && opts.app === false) {
    prefix = '';
  }

  levels.forEach(function(level) {
    var d = debug(prefix+[domain, level].join(':'));

    if ('undefined' !== typeof console[level]) {
      d.log = function() {
        return console[level].apply(console, arguments);
      };
    }

    var fn = function(msg) {
      if (!msg) { return; } // Skip empty messages.
      if (msg instanceof Error) {
        var err = errorify.apply(this, arguments);
        d.apply(null, [colors[level](util.inspect(err)), colors.data(err.stack)]);
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
