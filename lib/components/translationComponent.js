'use strict';

var _Map = require('babel-runtime/core-js/map').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.format = format;
exports.vformat = vformat;
exports.initialize = initialize;
exports.extendsHttpContextPrototype = extendsHttpContextPrototype;

var _objectProperties = require('object-properties');

/**
 * Format a string using %s
 *
 * @param {String} string
 * @param {...String} args
 * @return {String}
 */
/** @function 
* @param string 
* @param {...*} args */
function format(string) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return vformat(string, args);
}

;

/**
 * Format a string using %s
 *
 * @param {String} string
 * @param {string[]} args
 * @return {String}
 */
/** @function 
* @param string 
* @param args */
function vformat(string, args) {
    var i = 0;
    return string.replace(/%s/g, function (m) {
        return args[i++] || '';
    });
}

;

/** @function 
* @param app */
function initialize(app) {
    app.translations = new _Map();
    app.config.get('availableLanguages').forEach(function (language) {
        app.translations.set(language, app.loadConfig('locales/' + language));
    });
}

/** @function 
* @param HttpContextPrototype */
function extendsHttpContextPrototype(HttpContextPrototype) {
    (0, _objectProperties.defineProperty)(HttpContextPrototype, 't', /** @function 
                                                                     * @param string 
                                                                     * @param {...*} args */function (string) {
        console.log(this.request.language);
        string = this.app.translations.get(this.request.language).get(string) || string;

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        return args ? vformat(string, args) : string;
    });
}
//# sourceMappingURL=translationComponent.js.map