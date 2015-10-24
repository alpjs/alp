// TODO request-params package

'use strict';

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _get = require('babel-runtime/helpers/get').default;

var _inherits = require('babel-runtime/helpers/inherits').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.extendsHttpRequestPrototype = extendsHttpRequestPrototype;

var _objectProperties = require('object-properties');

/** @class ParamValueValidator 
* @param validator 
* @param name 
* @param value */
let ParamValueValidator = (function () {
    function ParamValueValidator(validator, name, value) {
        _classCallCheck(this, ParamValueValidator);

        this.validator = validator;
        this.name = name;
        this.value = value;
    }

    _createClass(ParamValueValidator, [{
        key: '_error',
        /** @memberof ParamValueValidator 
        * @instance 
        * @method _error 
        * @param key */value: function _error(key) {
            this.validator._error(this.name, key, this.value);
        }
    }]);

    return ParamValueValidator;
})();

/** @class ParamValueStringValidator */
let ParamValueStringValidator = (function (_ParamValueValidator) {
    _inherits(ParamValueStringValidator, _ParamValueValidator);

    function ParamValueStringValidator() {
        _classCallCheck(this, ParamValueStringValidator);

        _get(Object.getPrototypeOf(ParamValueStringValidator.prototype), 'constructor', this).apply(this, arguments);
    }

    /*
    class ParamValueModelValidator extends ParamValueValidator {
        required() {
            if (this.value == null) {
                this._error('required');
            }
            return this;
        }
        valid(fieldsRequired) {
            if (this.value == null) {
                return this;
            }
            if (S.isString(fieldsRequired)) {
                fieldsRequired = fieldsRequired.split(' ');
            }
            S.forEach(this.value.constructor.Fields, (name, fModel) => {
                let value = this.value[name];
                if (fieldsRequired) {
                    if(S.array.has(fieldsRequired, name) && value == null) {
                        this._error('required');
                    }
                } else {
                    if (value == null && fModel[1] && fModel[1].required) {
                        this._error('required');
                    }
                }
                //TODO ...
            });
            return this;
        }
    }
    */

    _createClass(ParamValueStringValidator, [{
        key: 'notEmpty',
        /** @memberof ParamValueStringValidator 
        * @instance 
        * @method notEmpty */value: function notEmpty() {
            if (this.value == null || this.value.trim() === '') {
                this._error('notEmpty');
            }

            return this;
        }
    }]);

    return ParamValueStringValidator;
})(ParamValueValidator);

/** @class ParamValidator 
* @param request */
let ParamValidator = (function () {
    function ParamValidator(request) {
        _classCallCheck(this, ParamValidator);

        this.request = request;
    }

    _createClass(ParamValidator, [{
        key: '_error',
        /** @memberof ParamValidator 
        * @instance 
        * @method _error 
        * @param name 
        * @param key 
        * @param value */value: function _error(name, key, value) {
            if (!this._errors) {
                this._errors = {};
            }

            this._errors[name] = { error: key, value: value };
        }
    }, {
        key: 'getErrors',
        /** @memberof ParamValidator 
        * @instance 
        * @method getErrors */value: function getErrors() {
            return this._errors;
        }
    }, {
        key: 'hasErrors',
        /** @memberof ParamValidator 
        * @instance 
        * @method hasErrors */value: function hasErrors() {
            return !!this._errors;
        }
    }, {
        key: 'isValid',
        /** @memberof ParamValidator 
        * @instance 
        * @method isValid */value: function isValid() {
            return !this._errors;
        }
    }, {
        key: 'string',
        /** @memberof ParamValidator 
        * @instance 
        * @method string 
        * @param name 
        * @param position */value: function string(name, position) {
            return new ParamValueStringValidator(this, name, this.request.param(name, position));
        }

        /*int(name, position) {
            return new ParamValueIntValidator(this, name, this.request.param(name, position));
        }
        model(modelName, name) {
            name = name || S.string.lcFirst(modelName);
            console.log('paramvalidator model', modelName, M[modelName]);
            let data = this.request.getOrPostParam(name);
            return new ParamValueModelValidator(this, name, !data ? null : new M[modelName](data));
        }*/
    }]);

    return ParamValidator;
})();

/** @class ParamValidatorValid */
let ParamValidatorValid = (function (_ParamValidator) {
    _inherits(ParamValidatorValid, _ParamValidator);

    function ParamValidatorValid() {
        _classCallCheck(this, ParamValidatorValid);

        _get(Object.getPrototypeOf(ParamValidatorValid.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ParamValidatorValid, [{
        key: '_error',
        /** @memberof ParamValidatorValid 
        * @instance 
        * @method _error */value: function _error() {
            /* #if DEV */
            console.warn('Invalid params: ', arguments, '\nRoute=', this.request.route, '\nGET=', this.request.query, '\nBody=', this.request.body);
            /* #/if */
            throw S.HttpError.notFound(undefined, 'Invalid params');
        }
    }]);

    return ParamValidatorValid;
})(ParamValidator);

/** @function 
* @param HttpRequestPrototype */
function extendsHttpRequestPrototype(HttpRequestPrototype) {
    (0, _objectProperties.defineProperties)(HttpRequestPrototype, {
        param(name) {
            return this.namedParam(name) || this.paramGET(name);
        },

        namedParam(name) {
            let namedParams = this.route.namedParams;
            return namedParams && namedParams.get(name);
        },

        otherParam(position) {
            let otherParams = this.route.otherParams;
            return otherParams && otherParams[position - 1];
        },

        paramGET(name) {
            let query = this.query;
            return query && query[name];
        },

        paramGETorPOST(name) {
            return this.body[name] !== undefined ? this.body[name] : this.query[name];
        }
    });

    (0, _objectProperties.defineLazyProperty)(HttpRequestPrototype, 'params', /** @function */function () {
        return new ParamValidator(this);
    });

    (0, _objectProperties.defineLazyProperty)(HttpRequestPrototype, 'validParams', /** @function */function () {
        return new ParamValidatorValid(this);
    });
}

;
//# sourceMappingURL=validatorComponent.js.map