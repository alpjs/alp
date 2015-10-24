'use strict';

var _Promise = require('babel-runtime/core-js/promise').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

var _objectProperties = require('object-properties');

var _http = require('http');

var _negotiatorLibLanguage = require('negotiator/lib/language');

var _negotiatorLibMediaType = require('negotiator/lib/mediaType');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

const urlencodedBodyParser = _bodyParser2.default.urlencoded({ extended: false });
const jsonBodyParser = _bodyParser2.default.json();

(0, _objectProperties.defineLazyProperty)(_http.IncomingMessage.prototype, 'language', /** @function */function () {
    let languages = (0, _negotiatorLibLanguage.preferredLanguages)(this.headers['accept-language'], this.app.config.get('availableLanguages'));
    return languages && languages[0] || 'em';
});

(0, _objectProperties.defineLazyProperty)(_http.IncomingMessage.prototype, 'ieVersion', /** @function */function () {
    let ua = this.headers['user-agent'];

    if (!ua) {
        return function () {
            return false;
        };
    }

    let m = ua.match(/MSIE ([\d\.]+)/i);

    if (!m) {
        return function () {
            return false;
        };
    }

    const value = m[1];
    return function () {
        return value;
    };
});

(0, _objectProperties.defineProperty)(_http.IncomingMessage.prototype, 'isIElt7', /** @function */function () {
    var _this = this;

    (function () {
        return _this.ieVersion < 7;
    });
});
(0, _objectProperties.defineProperty)(_http.IncomingMessage.prototype, 'isIElt8', /** @function */function () {
    var _this2 = this;

    (function () {
        return _this2.ieVersion < 8;
    });
});
(0, _objectProperties.defineProperty)(_http.IncomingMessage.prototype, 'isIElt9', /** @function */function () {
    var _this3 = this;

    (function () {
        return _this3.ieVersion < 9;
    });
});

(0, _objectProperties.defineProperty)(_http.IncomingMessage.prototype, 'accepts', /** @function 
                                                                                  * @param types */function (types) {
    return (0, _negotiatorLibMediaType.preferredMediaTypes)(this.headers.accept, types);
});

(0, _objectProperties.defineProperty)(_http.IncomingMessage.prototype, 'parseBody', /** @function */function () {
    var _this4 = this;

    if (this.body) {
        throw new Error('Request is already parsed');
    }

    return new _Promise(function (resolve, reject) {
        urlencodedBodyParser(_this4, _this4.response, function (err) {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
});

(0, _objectProperties.defineProperty)(_http.IncomingMessage.prototype, 'parseJsonBody', /** @function */function () {
    var _this5 = this;

    if (this.body) {
        throw new Error('Request is already parsed');
    }

    return new _Promise(function (resolve, reject) {
        jsonBodyParser(_this5, _this5.response, function (err) {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
});

(0, _objectProperties.defineLazyProperty)(_http.IncomingMessage.prototype, 'isHttps', /** @function */function () {
    if (!this.app.config.get('behindProxy')) {
        return this.connection.encrypted;
    }

    if (this.headers['x-forwarded-proto'] === 'https') {
        return true;
    }

    return false;
});

(0, _objectProperties.defineLazyProperty)(_http.IncomingMessage.prototype, 'hostname', /** @function */function () {
    let host = this.headers[!this.app.config.get('behindProxy') ? 'host' : 'x-forwarded-host'];

    if (!host) {
        throw new Error('Header host not set');
    }

    return host.split(':')[0];
});
//# sourceMappingURL=HttpServerRequest.js.map