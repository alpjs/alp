'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createServer = createServer;

var _fs = require('fs');

var _http = require('http');

var _processRequest = require('./processRequest');

/** @function 
* @param app */
function createServer(app) {
    const publicDir = app.paths.public;

    const socketPath = app.config.get('socketPath');
    const port = app.config.get('port');
    const hostname = app.config.get('hostname');

    app.logger.info('Creating server', socketPath ? { socketPath: socketPath } : { port: port }, { [socketPath ? 'socketPath' : 'port']: ['yellow'] });

    if (socketPath) {
        try {
            (0, _fs.unlinkSync)(socketPath);
        } catch (err) {}
    }

    const server = (0, _http.createServer)((0, _processRequest.createRequestProcessor)(app));

    server.listen(socketPath || port, hostname, /** @function */function () {
        if (socketPath) {
            (0, _fs.chmodSync)(socketPath, '777');
        }
        app.logger.info('Server listening', socketPath ? { socketPath: socketPath } : { port: port }, { [socketPath ? 'socketPath' : 'port']: ['yellow'] });
    });
}
//# sourceMappingURL=server.js.map