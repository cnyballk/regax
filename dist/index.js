'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.Store = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////// util
var toType = function toType(obj) {
  return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};
// import { toType } from './util/index.js';
var Context = (0, _react.createContext)();

//////////////// Store

var Store = exports.Store = function () {
  function Store(_ref) {
    var state = _ref.state,
        contros = _ref.contros;
    (0, _classCallCheck3.default)(this, Store);

    this.state = state;
    this.contros = contros;
    this.listeners = [];
  }

  (0, _createClass3.default)(Store, [{
    key: 'listen',
    value: function listen(listener) {
      return this.listeners.push(listener);
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }
  }, {
    key: 'notify',
    value: function notify(contro) {
      var _this = this;

      return function () {
        var newState = _this.contros[contro](_this.state);
        if (toType(newState) !== 'object') throw Error('Hey,Brother, please return an object');
        _this.state = newState;
        _this.listeners.forEach(function (fn) {
          return fn();
        });
      };
    }
  }]);
  return Store;
}();
////////////////////////////////////////////////

////////////////Provider


var Provider = exports.Provider = function (_Component) {
  (0, _inherits3.default)(Provider, _Component);

  function Provider() {
    (0, _classCallCheck3.default)(this, Provider);
    return (0, _possibleConstructorReturn3.default)(this, (Provider.__proto__ || (0, _getPrototypeOf2.default)(Provider)).apply(this, arguments));
  }

  (0, _createClass3.default)(Provider, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        Context.Provider,
        { value: this.props.store },
        this.props.children
      );
    }
  }]);
  return Provider;
}(_react.Component);
////////////////////////////////////////////////