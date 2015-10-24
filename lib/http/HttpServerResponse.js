'use strict';

var _Promise = require('babel-runtime/core-js/promise').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

var _objectProperties = require('object-properties');

var _http = require('http');

var _fs = require('fs');

var _HttpError = require('./HttpError');

var _HttpError2 = _interopRequireDefault(_HttpError);

var _HttpStatus = require('./HttpStatus');

var _HttpStatus2 = _interopRequireDefault(_HttpStatus);

var _escapeHtml = require('escape-html');

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

var _alouetteLibHtmlRenderer = require('alouette/lib/HtmlRenderer');

var _alouetteLibHtmlRenderer2 = _interopRequireDefault(_alouetteLibHtmlRenderer);

(0, _objectProperties.defineProperties)(_http.ServerResponse.prototype, {
    /**
     * @param {Object} params
     * @param {string} params.content
     * @param {string} params.filename
     */
    sendText(_ref) {
        let content = _ref.content;
        let filename = _ref.filename;

        this.writeHead(200, {
            'Content-Type': 'text/plain',
            'Accept-Ranges': 'none',
            'Content-Length': content.length,
            'Content-Disposition': 'attachment; filename=' + filename
        });

        this.end(content);
    },

    /**
     * @param {number} statusCode
     * @return {HttpServerResponse} this
     */
    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    },

    /**
     * @param {string} string
     */
    text(string) {
        this.setHeader('Content-Type', 'text/plain');
        this.setHeader('Content-Length', string.length);
        this.end(string);
    },

    /**
     * @param {string} string
     */
    json(string) {
        this.setHeader('Content-Type', 'application/json');
        this.setHeader('Content-Length', string.length);
        this.end(string);
    },

    /**
     * @param {*} jsonValue
     */
    toJson(jsonValue) {
        this.json(JSON.stringify(jsonValue));
    },

    /**
     * @param {string} string
     */
    html(string) {
        this.setHeader('Content-Type', 'text/html');
        this.setHeader('Content-Length', string.length);
        this.end(string);
    },

    /**
     * @param {string} path
     */
    sendFile(path) {
        var _this = this;

        return new _Promise(function (resolve, reject) {
            (0, _fs.createReadStream)(path).pipe(_this).on('end', resolve).on('error', reject);
        });
    },

    /**
     * @param {string} details details of the error, displayed even in production
     * @param {Error} error
     */
    notFound(details, error) {
        this.httpError(_HttpError2.default.notFound(details, error));
    },

    /**
     * @param {HttpError} httpError
     */
    httpError(_httpError) {
        const isProduction = this.request.app.production;

        if (!(_httpError instanceof _HttpError2.default)) {
            this.request.app.logger.warning('httpError is not an instance of HttpError');
            _httpError = S.HttpError.internalServerError(undefined, undefined, error);
        }

        let error = _httpError;
        while (error && !(error instanceof Error)) {
            error = error.previous;
        }

        if (!isProduction && error) {
            this.request.app.logger.error('httpError');
            this.request.app.logger.error(error);
        }

        const status = _httpError.status || 500;
        this.status(status);

        let body = (isProduction || !_httpError.error ? _http.STATUS_CODES[status] : _httpError.error) + (_httpError.details ? '\n' + _httpError.details : '');

        const accepts = this.request.accepts(['text/html']);
        if (accepts[0] === 'text/html') {
            body = '<pre>' + (0, _escapeHtml2.default)(body) + '</pre>';

            if (!isProduction) {
                if (typeof _httpError.error === 'string' && _httpError.error.startsWith('<!DOCTYPE html>')) {
                    body = _httpError.error;
                }

                try {
                    var htmlStackRenderer = new _alouetteLibHtmlRenderer2.default({ production: isProduction });

                    if (error) {
                        body += htmlStackRenderer.render(error);
                    }
                } catch (error2) {
                    console.log(_httpError.stack);
                    console.log('err while log error:', error2.stack);
                }
            }

            this.html(body);
        } else {
            this.text(body);
        }
    },

    /**
     * @param {number} [status]
     * @param {string} url
     */
    redirect(status, url) {
        if (url === undefined) {
            url = status;
            status = _HttpStatus2.default.FOUND;
        }

        let body;

        const accepts = this.request.accepts(['text/html', 'text']);
        if (accepts[0] === 'text/html') {
            this.setHeader('Content-Type', 'text/html');
            var escapedUrl = (0, _escapeHtml2.default)(url);
            body = '<html><body><p>' + _http.STATUS_CODES[status] + '.' + 'Redirecting to <a href="' + escapedUrl + '">' + escapedUrl + '</a></p></body></html>';
        } else if (accepts[0] === 'text') {
            this.setHeader('Content-Type', 'text/plain');
            body = _http.STATUS_CODES[status] + '. Redirecting to ' + url;
        }

        this.setHeader('Location', url);
        this.statusCode = status;
        this.end(body);
    }
});
//# sourceMappingURL=HttpServerResponse.js.map