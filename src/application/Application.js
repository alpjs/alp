import { createConfig, existsConfig, loadConfig } from './config';
import { createRouter } from './router';
import { ConsoleLogger, LogLevel } from 'nightingale';
import { dirname as pathDirname } from 'path';
import ConsoleHandler from 'nightingale/lib/handlers/ConsoleHandler';
import { IncomingMessage, ServerResponse } from 'http';
import RequestContext from '../http/RequestContext';
import { defineProperty } from 'object-properties';
import * as translationComponent from '../components/translationComponent';
import * as validatorComponent from '../components/validatorComponent';

const _existsConfig = existsConfig;
const _loadConfig = loadConfig;

export default class Application {
    constructor(dirname, environment) {
        this.dirname = dirname;
        this.environment = environment;

        const dirname2 = pathDirname(dirname);
        this.paths = Object.freeze(
            {
                public: dirname2 + '/public/',
                data: dirname2 + '/data/',
                tmp: dirname2 + '/tmp/',
                logs: dirname2 + '/logs/',
            }
        );

        this.config = createConfig(this);
        this.production = !!this.config.get('production');

        const logConfig = this.config.get('log');
        this.logger = new ConsoleLogger('app', logConfig && logConfig.level || LogLevel.ALL);

        this.router = createRouter(this);

        this.controllers = new Map();
        const controllers = this.require('controllers');
        Object.keys(controllers).forEach(key => {
            this.controllers.set(key, controllers[key]);
        });

        this.loadComponent(translationComponent);
        this.loadComponent(validatorComponent);

        Object.freeze(this);
    }

    require(path) {
        return require(this.dirname + path);
    }

    loadComponent(component) {
        if (component.initialize) {
            component.initialize(this);
        }

        if (component.extendsHttpRequestPrototype) {
            component.extendsHttpRequestPrototype(IncomingMessage.prototype);
        }

        if (component.extendsHttpResponsePrototype) {
            component.extendsHttpResponsePrototype(ServerResponse.prototype);
        }

        if (component.extendsHttpContextPrototype) {
            component.extendsHttpContextPrototype(RequestContext.prototype);
        }
    }

    existsConfig(name) {
        return _existsConfig(this, name);
    }

    loadConfig(name) {
        return _loadConfig(this, name);
    }
}
