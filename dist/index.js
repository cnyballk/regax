'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.orm = exports.Store = undefined;

var _sotre = require('./core/sotre');

var _sotre2 = _interopRequireDefault(_sotre);

var _index = require('./react/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Store = _sotre2.default;
exports.orm = _index.orm;
exports.Provider = _index.Provider;