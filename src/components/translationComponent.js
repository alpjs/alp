import { defineProperty, defineLazyProperty } from 'object-properties';

/**
 * Format a string using %s
 *
 * @param {String} string
 * @param {...String} args
 * @return {String}
 */
export function format(string, ...args) {
    return vformat(string, args);
};

/**
 * Format a string using %s
 *
 * @param {String} string
 * @param {string[]} args
 * @return {String}
 */
export function vformat(string, args) {
    var i = 0;
    return string.replace(/%s/g, (m) => args[i++] || '');
};

export function initialize(app) {
    app.translations = new Map();
    app.config.get('availableLanguages').forEach(language => {
        app.translations.set(language, app.loadConfig('locales/' + language));
    });
}

export function extendsHttpContextPrototype(HttpContextPrototype) {
    defineProperty(HttpContextPrototype, 't', function(string, ...args) {
        console.log(this.request.language);
        string = this.app.translations.get(this.request.language).get(string) || string;
        return args ? vformat(string, args) : string;
    });
}
