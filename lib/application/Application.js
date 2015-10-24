'use strict';

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _Object$freeze = require('babel-runtime/core-js/object/freeze').default;

var _Map = require('babel-runtime/core-js/map').default;

var _Object$keys = require('babel-runtime/core-js/object/keys').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _config = require('./config');

var _router = require('./router');

var _nightingale = require('nightingale');

var _path = require('path');

var _nightingaleLibHandlersConsoleHandler = require('nightingale/lib/handlers/ConsoleHandler');

var _nightingaleLibHandlersConsoleHandler2 = _interopRequireDefault(_nightingaleLibHandlersConsoleHandler);

var _http = require('http');

var _httpRequestContext = require('../http/RequestContext');

var _httpRequestContext2 = _interopRequireDefault(_httpRequestContext);

var _objectProperties = require('object-properties');

var _componentsTranslationComponent = require('../components/translationComponent');

var translationComponent = _interopRequireWildcard(_componentsTranslationComponent);

var _componentsValidatorComponent = require('../components/validatorComponent');

var validatorComponent = _interopRequireWildcard(_componentsValidatorComponent);

const _existsConfig = _config.existsConfig;
const _loadConfig = _config.loadConfig;

/** @class Application 
* @param dirname 
* @param environment */
let Application = (function () {
    function Application(dirname, environment) {
        var _this = this;

        _classCallCheck(this, Application);

        this.dirname = dirname;
        this.environment = environment;

        const dirname2 = (0, _path.dirname)(dirname);
        this.paths = _Object$freeze({
            public: dirname2 + '/public/',
            data: dirname2 + '/data/',
            tmp: dirname2 + '/tmp/',
            logs: dirname2 + '/logs/'
        });

        this.config = (0, _config.createConfig)(this);
        this.production = !!this.config.get('production');

        const logConfig = this.config.get('log');
        this.logger = new _nightingale.ConsoleLogger('app', logConfig && logConfig.level || _nightingale.LogLevel.ALL);

        this.router = (0, _router.createRouter)(this);

        this.controllers = new _Map();
        const controllers = this.require('controllers');
        _Object$keys(controllers).forEach(function (key) {
            _this.controllers.set(key, controllers[key]);
        });

        this.loadComponent(translationComponent);
        this.loadComponent(validatorComponent);

        _Object$freeze(this);
    }

    _createClass(Application, [{
        key: 'require',
        /** @memberof Application 
        * @instance 
        * @method require 
        * @param path */value: (function (_require) {
            function require(_x) {
                return _require.apply(this, arguments);
            }

            require.toString = function () {
                return _require.toString();
            };

            return require;
        })(function (path) {
            return require(this.dirname + path);
        })
    }, {
        key: 'loadComponent',
        /** @memberof Application 
        * @instance 
        * @method loadComponent 
        * @param component */value: function loadComponent(component) {
            if (component.initialize) {
                component.initialize(this);
            }

            if (component.extendsHttpRequestPrototype) {
                component.extendsHttpRequestPrototype(_http.IncomingMessage.prototype);
            }

            if (component.extendsHttpResponsePrototype) {
                component.extendsHttpResponsePrototype(_http.ServerResponse.prototype);
            }

            if (component.extendsHttpContextPrototype) {
                component.extendsHttpContextPrototype(_httpRequestContext2.default.prototype);
            }
        }
    }, {
        key: 'existsConfig',
        /** @memberof Application 
        * @instance 
        * @method existsConfig 
        * @param name */value: function existsConfig(name) {
            return _existsConfig(this, name);
        }
    }, {
        key: 'loadConfig',
        /** @memberof Application 
        * @instance 
        * @method loadConfig 
        * @param name */value: function loadConfig(name) {
            return _loadConfig(this, name);
        }
    }]);

    return Application;
})();

exports.default = Application;
module.exports = exports.default;
//# sourceMappingURL=Application.js.map