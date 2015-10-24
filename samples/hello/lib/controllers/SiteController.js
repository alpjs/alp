'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _alp = require('alp');

exports.default = (0, _alp.newController)({
    index: _alp.newController.action( /** @function 
                                      * @param request 
                                      * @param response */_asyncToGenerator(function* (request, response) {
        const name = request.params.string('name').notEmpty().value;
        return response.end(this.t('Hello %s!', request.params.isValid() ? name : 'World'));
    }))
});
module.exports = exports.default;
//# sourceMappingURL=SiteController.js.map
