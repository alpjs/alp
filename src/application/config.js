import { existsSync, readFileSync } from 'fs';
import parseJSON from 'parse-json-object-as-map';

import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));

// To make obj fully immutable, freeze each object in obj.
// Also makes Array, Map and Set read-only.
function deepFreeze(obj) {
    if (obj instanceof Map) {
        obj.clear = obj.delete = obj.set = function() {
            throw new Error('map is read-only');
        };
    } else if (obj instanceof Set) {
        obj.add = obj.clear = obj.delete = function() {
            throw new Error('set is read-only');
        };
    }

    Object.getOwnPropertyNames(obj).forEach((name) => {
        let prop = obj[name];

        // Freeze prop if it is an object
        if (typeof prop == 'object' && !Object.isFrozen(prop)) {
            deepFreeze(prop);
        }
    });

    // Freeze self
    return Object.freeze(obj);
}

export function existsConfig(app, name) {
    return existsSync(app.dirname + 'config/' + name + '.json');
}

export function loadConfig(app, name) {
    let content = readFileSync(app.dirname + 'config/' + name + '.json');
    return parseJSON(content);
}

export function createConfig(app) {
    const config = loadConfig(app, 'common');
    for (let [key, value] of loadConfig(app, app.environment)) {
        config.set(key, value);
    }

    if (existsConfig(app, 'local')) {
        for (let [key, value] of loadConfig(app, 'local')) {
            config.set(key, value);
        }
    }

    let socketPath = argv['socket-path'] || argv.socketPath;
    if (socketPath) {
        config.set('socketPath', socketPath);
    } else if (argv.port) {
        config.set('port', argv.port);
        config.delete('socketPath');
    }

    return deepFreeze(config);
}
