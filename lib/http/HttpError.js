'use strict';

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _Object$seal = require('babel-runtime/core-js/object/seal').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _HttpStatus = require('./HttpStatus');

var _HttpStatus2 = _interopRequireDefault(_HttpStatus);

// TODO use https://github.com/jshttp/http-errors ?
/** @class HttpError 
* @param status 
* @param error 
* @param details 
* @param previous */
let HttpError = (function () {
    function HttpError(status, error, details, previous) {
        _classCallCheck(this, HttpError);

        this.status = status;
        this.error = error;
        this.details = details;

        if (previous) {
            this.previous = previous;
        }

        _Object$seal(this);
    }

    /** 400 
    * @memberof HttpError 
    * @static 
    * @method badRequest 
    * @param details 
    * @param message 
    * @param previous */

    _createClass(HttpError, null, [{
        key: 'badRequest',
        value: function badRequest(details, message, previous) {
            return new HttpError(_HttpStatus2.default.BAD_REQUEST, message, details, previous);
        }

        /** 403 
        * @memberof HttpError 
        * @static 
        * @method forbidden 
        * @param details 
        * @param message 
        * @param previous */
    }, {
        key: 'forbidden',
        value: function forbidden(details, message, previous) {
            return new HttpError(_HttpStatus2.default.FORBIDDEN, message, details, previous);
        }

        /** 404 
        * @memberof HttpError 
        * @static 
        * @method notFound 
        * @param details 
        * @param message 
        * @param previous */
    }, {
        key: 'notFound',
        value: function notFound(details, message, previous) {
            return new HttpError(_HttpStatus2.default.NOT_FOUND, message, details, previous);
        }

        /** 500 
        * @memberof HttpError 
        * @static 
        * @method internalServerError 
        * @param details 
        * @param message 
        * @param previous */
    }, {
        key: 'internalServerError',
        value: function internalServerError(details, message, previous) {
            return new HttpError(_HttpStatus2.default.INTERNAL_ERROR, message, details, previous);
        }
    }]);

    return HttpError;
})();

exports.default = HttpError;
module.exports = exports.default;
//# sourceMappingURL=HttpError.js.map