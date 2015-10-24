import { RouterBuilder, RoutesTranslations } from 'limosa';

export function createRouter(app) {
    const routeTranslationsConfig = app.config.routeTranslations;
    const routeTranslations = new RoutesTranslations(routeTranslationsConfig);
    const builder = new RouterBuilder(routeTranslations, ['en', 'fr']);
    app.require('router')(builder);
    return builder.router;
}
