import { defineProperty, defineLazyProperty } from 'object-properties';
import { IncomingMessage, STATUS_CODES } from 'http';

import { preferredLanguages } from 'negotiator/lib/language';
import { preferredMediaTypes } from 'negotiator/lib/mediaType';

import bodyParser from 'body-parser';

const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
const jsonBodyParser = bodyParser.json();

defineLazyProperty(IncomingMessage.prototype, 'language', function() {
    let languages = preferredLanguages(this.headers['accept-language'], this.app.config.get('availableLanguages'));
    return languages && languages[0] || 'em';
});

defineLazyProperty(IncomingMessage.prototype, 'ieVersion', function() {
    let ua = this.headers['user-agent'];

    if (!ua) {
        return () => false;
    }

    let m = ua.match(/MSIE ([\d\.]+)/i);

    if (!m) {
        return () => false;
    }

    const value = m[1];
    return () => value;
});

defineProperty(IncomingMessage.prototype, 'isIElt7', function() { () => this.ieVersion < 7; });
defineProperty(IncomingMessage.prototype, 'isIElt8', function() { () => this.ieVersion < 8; });
defineProperty(IncomingMessage.prototype, 'isIElt9', function() { () => this.ieVersion < 9; });

defineProperty(IncomingMessage.prototype, 'accepts', function(types) {
    return preferredMediaTypes(this.headers.accept, types);
});

defineProperty(IncomingMessage.prototype, 'parseBody', function() {
    if (this.body) {
        throw new Error('Request is already parsed');
    }

    return new Promise((resolve, reject) => {
        urlencodedBodyParser(this, this.response, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
});

defineProperty(IncomingMessage.prototype, 'parseJsonBody', function() {
    if (this.body) {
        throw new Error('Request is already parsed');
    }

    return new Promise((resolve, reject) => {
        jsonBodyParser(this, this.response, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
});

defineLazyProperty(IncomingMessage.prototype, 'isHttps', function() {
    if (!this.app.config.get('behindProxy')) {
        return this.connection.encrypted;
    }

    if (this.headers['x-forwarded-proto'] === 'https') {
        return true;
    }

    return false;
});

defineLazyProperty(IncomingMessage.prototype, 'hostname', function() {
    let host = this.headers[!this.app.config.get('behindProxy') ? 'host' : 'x-forwarded-host'];

    if (!host) {
        throw new Error('Header host not set');
    }

    return host.split(':')[0];
});
