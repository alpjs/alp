'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _alpNode = require('alp-node');

Object.keys(_alpNode).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _alpNode[key];
    }
  });
});

var _alpNode2 = _interopRequireDefault(_alpNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _alpNode2.default;
//# sourceMappingURL=node.js.map