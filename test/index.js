var chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    debug = require('..');

chai.use(sinonChai);

describe('better-debug', function() {
  var instance = debug('domain'),
      instance2 = debug('domain2');

  beforeEach(function() {
    sinon.spy(console, 'log');
    sinon.spy(console, 'warn');
    sinon.spy(console, 'error');
  });

  afterEach(function() {
    console.log.restore();
    console.warn.restore();
    console.error.restore();
  });

  it('is a function', function() {
    expect(debug).to.be.a('function');

    expect(instance).to.be.an('object');

    expect(instance.log).to.be.a('function');
    expect(instance.info).to.be.a('function');
    expect(instance.warn).to.be.a('function');
    expect(instance.error).to.be.a('function');
  });

  it('should use console.warn', function() {
    var err = new Error('test');

    instance.warn(err);
    expect(console.warn).to.be.calledOnce;
  });

  it('should use console.error', function() {
    var err = new Error('test');

    instance.error(err);
    expect(console.error).to.be.calledOnce;
  });

  it('should emit', function() {
    var error = sinon.spy(),
        warn = sinon.spy();

    debug.on('error', error);
    debug.on('warn', warn);

    var err = new Error('test');

    instance.error(err);
    expect(error).to.be.calledWith(err);

    instance.warn(err);
    expect(warn).to.be.calledWith(err);
  });

  describe('#ifError', function() {
    it('shouldn\'t do anything', function() {
      var error = sinon.spy();
      debug.on('error', error);

      instance.ifError(null);

      expect(error).to.not.be.called;
    });
    it('should output error', function() {
      var error = sinon.spy();
      debug.on('error', error);

      var err = new Error('test');
      instance.ifError(err);

      expect(error).to.be.calledWith(err);
    });
  });
});
