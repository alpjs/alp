"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.newController = newController;
Error.stackTraceLimit = Infinity; // TODO move somewhere else

function newController(actions) {
    return actions;
}

newController.action = function (action) {
    return action;
};
//# sourceMappingURL=index.js.map