/* jshint mocha: true, expr: true */

process.env.DEBUG = 'app:domain*';

var chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    debug = require('..');

chai.use(sinonChai);

describe('better-debug', function() {
  var instance1,
      instance2,
      instance3;

  before(function() {
    instance1 = debug('domain'),
    instance2 = debug('domain2'),
    instance3 = debug('some-domain');
  });

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

    expect(instance1).to.be.an('object');

    expect(instance1.log).to.be.a('function');
    expect(instance1.info).to.be.a('function');
    expect(instance1.warn).to.be.a('function');
    expect(instance1.error).to.be.a('function');
  });

  it('should use console.log', function() {
    instance1.log('test');
    expect(console.log).to.be.calledOnce;
  });

  it('should use console.warn', function() {
    var err = new Error('test');

    instance1.warn(err);
    expect(console.warn).to.be.calledOnce;
  });

  it('should use console.error', function() {
    var err = new Error('test');

    instance1.error(err);
    expect(console.error).to.be.calledOnce;
  });

  it('should emit', function() {
    var error = sinon.spy(),
        warn = sinon.spy();

    debug.on('error', error);
    debug.on('warn', warn);

    var err = new Error('test');

    instance1.error(err);
    expect(error).to.be.calledOnce;

    instance2.warn(err);
    expect(warn).to.be.calledOnce;
  });

  it('shouldn\'t do anything when first variable is empty', function() {
    var spy = sinon.spy();
    debug.on('log', spy);
    debug.on('info', spy);
    debug.on('warn', spy);
    debug.on('error', spy);

    instance1.log(null);
    instance1.info(null);
    instance1.warn(null);
    instance1.error(null);

    expect(spy).to.not.be.called;
  });

  it('should respect DEBUG variable', function() {
    var err = new Error('test');

    instance1.log(err);
    instance2.warn(err);
    instance3.error(err);

    expect(console.log).to.be.calledOnce;
    expect(console.warn).to.be.calledOnce;
    expect(console.error).to.not.be.calledOnce;
  });

  it('extends error object', function() {
    var err = new Error('test');

    instance1.error(err, {pass: true});

    expect(console.error).to.be.calledOnce;

    expect(err).to.have.property('pass').and.to.equal(true);
  });
});
