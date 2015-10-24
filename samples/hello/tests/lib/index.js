'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

var _springbokjsDaemon = require('springbokjs-daemon');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _assert = require('assert');

suite('test hello server', /** @function */function () {
    let daemon = (0, _springbokjsDaemon.node)(['--harmony', '--es_staging', 'lib/index.js', '--port', 5555]);

    suiteSetup(function (done) {
        daemon.start();
        daemon.on('stdout', function (data) {
            let string = data.toString().toLowerCase();
            if (string.indexOf('listening') !== -1) {
                if (done) {
                    done();
                }

                console.log('Server started');
            }
        });
    });

    suiteTeardown(function () {
        daemon.stop();
    });

    test('hello without name', function () {
        return (0, _nodeFetch2.default)('http://localhost:5555/').then(function (res) {
            return res.text();
        }).then(function (res) {
            (0, _assert.strictEqual)(res, 'Hello World!');
        });
    });

    test('hello with name', function () {
        return (0, _nodeFetch2.default)('http://localhost:5555/?name=Chris').then(function (res) {
            return res.text();
        }).then(function (res) {
            (0, _assert.strictEqual)(res, 'Hello Chris!');
        });
    });
});
//# sourceMappingURL=index.js.map