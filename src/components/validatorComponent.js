// TODO request-params package

import { defineProperties, defineLazyProperty } from 'object-properties';

class ParamValueValidator {
    constructor(validator, name, value) {
        this.validator = validator;
        this.name = name;
        this.value = value;
    }

    _error(key) {
        this.validator._error(this.name, key, this.value);
    }
}

class ParamValueStringValidator extends ParamValueValidator {
    notEmpty() {
        if (this.value == null || this.value.trim() === '') {
            this._error('notEmpty');
        }

        return this;
    }
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

class ParamValidator {
    constructor(request) {
        this.request = request;
    }

    _error(name, key, value) {
        if (!this._errors) {
            this._errors = {};
        }

        this._errors[name] = { error: key, value: value };
    }

    getErrors() {
        return this._errors;
    }

    hasErrors() {
        return !!this._errors;
    }

    isValid() {
        return !this._errors;
    }

    string(name, position) {
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
}

class ParamValidatorValid extends ParamValidator {
    _error() {
        /* #if DEV */
        console.warn('Invalid params: ', arguments,
            '\nRoute=', this.request.route,
            '\nGET=', this.request.query,
            '\nBody=', this.request.body);
        /* #/if */
        throw S.HttpError.notFound(undefined, 'Invalid params');
    }
}

export function extendsHttpRequestPrototype(HttpRequestPrototype) {
    defineProperties(HttpRequestPrototype, {
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
        },
    });

    defineLazyProperty(HttpRequestPrototype, 'params', function() {
        return new ParamValidator(this);
    });

    defineLazyProperty(HttpRequestPrototype, 'validParams', function() {
        return new ParamValidatorValid(this);
    });
};
