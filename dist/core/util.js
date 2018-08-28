'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.breakUpContros = exports.isPromise = exports.isArray = exports.toType = exports.isEmptyArray = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////// util
var isEmptyArray = exports.isEmptyArray = function isEmptyArray(arr) {
  return isArray(arr) ? arr.length === 0 : true;
};
var toType = exports.toType = function toType(obj) {
  return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};
var isArray = exports.isArray = function isArray(x) {
  return toType(x) === 'array';
};
var isPromise = exports.isPromise = function isPromise() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return x.then && toType(x.then) === 'function';
};
var breakUpContros = exports.breakUpContros = function breakUpContros(contros) {
  if (contros.state) {
    return (0, _extends3.default)({}, contros, { state: (0, _extends3.default)({}, contros.state, { loading: {} }) });
  }
  var state = {},
      methods = {};
  (0, _keys2.default)(contros).forEach(function (i) {
    state[i] = (0, _extends3.default)({}, contros[i].state, { loading: {} }) || { loading: {} };
    methods[i] = {};
    methods[i].syncs = contros[i].syncs || {};
    methods[i].asyncs = contros[i].asyncs || {};
  });
  return { state: state, methods: methods };
};
////////////////////////////////////////////////////////////////