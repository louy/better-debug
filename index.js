var colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var debug = require('debug');
var util = require('util'),
    extend = util._extend;


function errorify(err) {
  err = typeof err === 'object' ? err : new Error(err);
  err.meta = err.meta || {};

  [].forEach.call(arguments, function(argument, index) {
    if ( index === 0 ) return;
    if( typeof argument === 'object' ) {
      extend(err.meta, argument);
    }
  });

  return err;
}

module.exports = function(domain) {

  var log   = debug(['app', domain, 'log'].join(':'));
  var info  = debug(['app', domain, 'info'].join(':'));

  var error = function() {
    var err = errorify.apply(this, arguments);
    console.error('%s'.error + '\n%s'.data, util.inspect(err), err.stack);
  };

  var warn = function() {
    var err = errorify.apply(this, arguments);
    console.warn('%s'.warn + '\n%s'.data, util.inspect(err), err.stack);
  };

  return {
    log: log,
    info: info,
    warn: warn,
    error: error,

    // Use this function if you don't want to pass the error upwards.
    ifError: function(err) {
      if ( err ) {
        return error.apply(this, arguments);
      }
    },
  };
};

