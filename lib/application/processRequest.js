'use strict';

var _Promise = require('babel-runtime/core-js/promise').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createRequestProcessor = createRequestProcessor;

var _fs = require('fs');

var _url = require('url');

var _qs = require('qs');

var _httpHttpError = require('../http/HttpError');

var _httpHttpError2 = _interopRequireDefault(_httpHttpError);

var _httpRequestContext = require('../http/RequestContext');

var _httpRequestContext2 = _interopRequireDefault(_httpRequestContext);

/** @function 
* @param app */
function createRequestProcessor(app) {
    const error = /** @function 
                  * @param request 
                  * @param response 
                  * @param status 
                  * @param error */function error(request, response, status, _error) {
        if (!_error.code) {
            _error = new _httpHttpError2.default(_error && _error.status || status, _error && _error.message || _error, undefined, _error);
        }

        response.httpError(_error);
    };

    return function (request, response) {
        // TODO put parsed Url somewhere in request.
        const parsedUrl = (0, _url.parse)(request.url);
        const pathname = parsedUrl.pathname;

        if (pathname === '/favicon.ico') {
            app.debug(null, { method: request.method, pathname }, { method: ['gray'], pathname: ['gray'] });

            return (0, _fs.createReadStream)(publicDir + 'favicon.ico').on('error', error.bind(null, request, response, 404)).pipe(response);
        }

        if (pathname.startsWith('/web/')) {
            app.debug(null, { method: request.method, pathname }, { method: ['gray'], pathname: ['gray'] });

            if (pathname.includes('/../')) {
                return error(request, response, 400, pathname + 'contains /../');
            }

            return (0, _fs.createReadStream)(publicDir + pathname.substr(5)).on('error', error.bind(null, request, response, 404)).pipe(response);
        }

        const started = Date.now();

        request.app = app;
        request.response = response;
        response.request = request;

        if (parsedUrl.query) {
            request.query = (0, _qs.parse)(parsedUrl.query);
        }

        let route;

        try {
            route = app.router.find(pathname);
        } catch (err) {
            return error(request, response, 500, err);
        }

        if (!route) {
            return error(request, response, 404, 'Route not found: ' + pathname);
        }

        const controller = app.controllers.get(route.controller);
        if (!controller) {
            return error(request, response, 404, 'Controller not found: ' + route.controller);
        }

        request.route = route;

        const context = new _httpRequestContext2.default(request, response);

        _Promise.resolve(context.callAction(route.controller, route.action)).catch(function (err) {
            return error(request, response, 500, err);
        }).then(function () {
            var timeMs = Date.now() - started + 'ms';
            var statusCode = response.statusCode;

            var stylesStatusCode;
            if (statusCode < 200) {
                stylesStatusCode = [];
            } else if (statusCode < 300) {
                stylesStatusCode = ['green', 'bold'];
            } else if (statusCode < 400) {
                stylesStatusCode = ['blue', 'bold'];
            } else if (statusCode < 500) {
                stylesStatusCode = ['bgMagenta', 'white'];
            } else if (statusCode < 600) {
                stylesStatusCode = ['bgRed', 'white'];
            }

            app.logger.info('Request handled', { method: request.method, statusCode, pathname, timeMs }, {
                statusCode: stylesStatusCode,
                pathname: ['magenta'],
                time: ['blue']
            });
        });
    };
}
//# sourceMappingURL=processRequest.js.map