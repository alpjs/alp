'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.newController = newController;
exports.start = start;

require('./http/HttpServerRequest');

require('./http/HttpServerResponse');

var _applicationApplication = require('./application/Application');

var _applicationApplication2 = _interopRequireDefault(_applicationApplication);

var _applicationServer = require('./application/server');

Error.stackTraceLimit = Infinity; //TODO move somewhere else

/** @function 
* @param actions */
function newController(actions) {
    return actions;
}

newController.action = /** @function 
                       * @param action */function (action) {
    return action;
};

/** @function 
* @param dirname */
function start(dirname) {
    dirname = dirname.replace(/\/+$/, '') + '/';

    const env = process.env.NODE_ENV || 'dev';

    if (!/^[a-z]+$/.test(env)) {
        throw new Error('Unacceptable env name: ' + env);
    }

    const app = new _applicationApplication2.default(dirname, env);

    (0, _applicationServer.createServer)(app);

    return app;
}
//# sourceMappingURL=index.js.map