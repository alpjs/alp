'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createRouter = createRouter;

var _limosa = require('limosa');

/** @function 
* @param app */
function createRouter(app) {
    const routeTranslationsConfig = app.config.routeTranslations;
    const routeTranslations = new _limosa.RoutesTranslations(routeTranslationsConfig);
    const builder = new _limosa.RouterBuilder(routeTranslations, ['en', 'fr']);
    app.require('router')(builder);
    return builder.router;
}
//# sourceMappingURL=router.js.map