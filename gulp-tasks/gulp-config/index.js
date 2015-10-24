const YML = require('js-yaml');
const util = require('util');
const PluginError = require('gulp-util').PluginError;
const replaceExtension = require('gulp-util').replaceExtension;
const through = require('through2');

module.exports = function(opts) {
    if (opts == null) {
        opts = {};
    }

    return through.obj(
        function(file, enc, cb) {
            if (file.isStream()) {
                return this.emit('error', new PluginError('gulp-config', 'Streams are not supported!'));
            } else if (file.isBuffer()) {
                try {
                    var content = file.contents.toString('utf8');
                    var data = YML.safeLoad(content, opts);

                    if (!data) {
                        data = {};
                    }

                    var config = data.common || {};
                    if (opts.dest === 'server') {
                        Object.assign(config, data.server || {});
                    } else if (opts.dest === 'browser') {
                        Object.assign(config, data.browser || {});
                    } else {
                        throw new Error('gulp-config: unknown destination');
                    }

                    file.path = replaceExtension(file.path, '.json');
                    file.contents = new Buffer(JSON.stringify(config, null, 4));
                    this.push(file);
                    return cb();
                } catch (error) {
                    this.emit('error', error);
                    return cb();
                }
            } else if (file.isNull()) {
                this.push(file);
                return cb();
            }
        }
    );
};
