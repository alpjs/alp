import { defineProperties, defineLazyProperty } from 'object-properties';
import { ServerResponse, STATUS_CODES } from 'http';
import { createReadStream } from 'fs';
import HttpError from './HttpError';
import HttpStatus from './HttpStatus';
import escape from 'escape-html';
import HtmlStackRenderer from 'alouette/lib/HtmlRenderer';

defineProperties(ServerResponse.prototype, {
    /**
     * @param {Object} params
     * @param {string} params.content
     * @param {string} params.filename
     */
    sendText({ content, filename }) {
        this.writeHead(200, {
            'Content-Type': 'text/plain',
            'Accept-Ranges': 'none',
            'Content-Length': content.length,
            'Content-Disposition': 'attachment; filename=' + filename,
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
        return new Promise((resolve, reject) => {
            createReadStream(path)
                .pipe(this)
                .on('end', resolve)
                .on('error', reject);
        });
    },

    /**
     * @param {string} details details of the error, displayed even in production
     * @param {Error} error
     */
    notFound(details, error) {
        this.httpError(HttpError.notFound(details, error));
    },

    /**
     * @param {HttpError} httpError
     */
    httpError(httpError) {
        const isProduction = this.request.app.production;

        if (!(httpError instanceof HttpError)) {
            this.request.app.logger.warning('httpError is not an instance of HttpError');
            httpError = S.HttpError.internalServerError(undefined, undefined, error);
        }

        let error = httpError;
        while (error && !(error instanceof Error)) {
            error = error.previous;
        }

        if (!isProduction && error) {
            this.request.app.logger.error('httpError');
            this.request.app.logger.error(error);
        }

        const status = httpError.status || 500;
        this.status(status);

        let body = (isProduction || !httpError.error ? STATUS_CODES[status] : httpError.error)
                        + (httpError.details ? '\n' + httpError.details : '');

        const accepts = this.request.accepts(['text/html']);
        if (accepts[0] === 'text/html') {
            body = '<pre>' + escape(body) + '</pre>';

            if (!isProduction) {
                if (typeof httpError.error === 'string' && httpError.error.startsWith('<!DOCTYPE html>')) {
                    body = httpError.error;
                }

                try {
                    var htmlStackRenderer = new HtmlStackRenderer({ production: isProduction });

                    if (error) {
                        body += htmlStackRenderer.render(error);
                    }
                } catch (error2) {
                    console.log(httpError.stack);
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
            status = HttpStatus.FOUND;
        }

        let body;

        const accepts = this.request.accepts(['text/html', 'text']);
        if (accepts[0] === 'text/html') {
            this.setHeader('Content-Type', 'text/html');
            var escapedUrl = escape(url);
            body = '<html><body><p>' + STATUS_CODES[status] + '.'
                        + 'Redirecting to <a href="' + escapedUrl + '">' + escapedUrl + '</a></p></body></html>';
        } else if (accepts[0] === 'text') {
            this.setHeader('Content-Type', 'text/plain');
            body = STATUS_CODES[status] + '. Redirecting to ' + url;
        }

        this.setHeader('Location', url);
        this.statusCode = status;
        this.end(body);
    },
});
