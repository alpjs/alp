"use strict";

var _Object$freeze = require("babel-runtime/core-js/object/freeze").default;

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _Object$freeze({
    COMMUNICATION_FAILED: 0,

    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NOT_AUTHORITATIVE: 203,
    NO_CONTENT: 204,
    RESET: 205,
    PARTIAL: 206,

    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    /**
     * A request was made of a resource using a request method not supported by that resource
     * For example, using GET on a form which requires data to be presented via POST,
     * or using PUT on a read-only resource.
     * @type {Number}
     */
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    CLIENT_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECON_FAILED: 412,
    ENTITY_TOO_LARGE: 413,
    REQUEST_URI_TOO_LONG: 414,
    UNSUPPORTED_TYPE: 415,

    INTERNAL_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    VERSION: 505
});
module.exports = exports.default;
//# sourceMappingURL=HttpStatus.js.map