export default class RequestContext {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.app = request.app;
    }

    /**
     *
     * @param {string} controllerName
     * @param {string} actionName
     * @returns {*}
     */
    callAction(controllerName, actionName) {
        const route = this.request.route;
        if (!actionName) {
            actionName = controllerName;
            controllerName = route.controller;
        }

        const controller = this.app.controllers.get(route.controller);
        if (!controller) {
            return this.response.notFound(undefined, 'Controller not found: ' + controllerName);
        }

        const action = controller[actionName];
        if (!action/* || !action.isAction*/) {
            return this.response.notFound(undefined, 'Action not found: ' +
                         route.controller + '.' + route.action);
        }

        return controller[actionName].call(this, this.request, this.response);
    }
}
