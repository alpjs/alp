'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _alpBrowser = require('alp-browser');

Object.keys(_alpBrowser).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _alpBrowser[key];
    }
  });
});

var _alpBrowser2 = _interopRequireDefault(_alpBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _alpBrowser2.default;
//# sourceMappingURL=browser.js.map