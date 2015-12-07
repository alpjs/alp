Error.stackTraceLimit = Infinity; // TODO move somewhere else

export function newController(actions) {
    return actions;
}

newController.action = function (action) {
    return action;
};
