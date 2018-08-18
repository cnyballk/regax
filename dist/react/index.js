'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.orm = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mContext = (0, _react.createContext)();

//////////////// Hoc orm  ===>  {state,contro}
var orm = exports.orm = function orm(mapState, mapMethods) {
  return function (WarpperComponent) {
    return function (_Component) {
      (0, _inherits3.default)(_class, _Component);

      function _class(props) {
        (0, _classCallCheck3.default)(this, _class);

        var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this, props));

        _this._isMounted = false;
        _this.state = {};
        _this._listen = _this._listen.bind(_this);
        _this.updata = _this.updata.bind(_this);
        return _this;
      }

      (0, _createClass3.default)(_class, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this._isMounted = true;
          this.store.listen(this.updata);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this._isMounted = false;
          this.store.unListen(this.updata);
        }
      }, {
        key: 'updata',
        value: function updata() {
          this.setState({});
        }
      }, {
        key: '_listen',
        value: function _listen(context) {
          if (!context) throw Error('Please be wrapped in a <Provider/>');
          var stateToProps = mapState(context.state);
          var methodsToProps = mapMethods(context.methods);
          return (0, _extends3.default)({}, stateToProps, methodsToProps);
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          return _react2.default.createElement(
            mContext.Consumer,
            null,
            function (context) {
              _this2.store = context;
              return _react2.default.createElement(WarpperComponent, _this2._listen(context));
            }
          );
        }
      }]);
      return _class;
    }(_react.Component);
  };
};

////////////////////////////////////////////////

////////////////Provider

var Provider = exports.Provider = function (_Component2) {
  (0, _inherits3.default)(Provider, _Component2);

  function Provider() {
    (0, _classCallCheck3.default)(this, Provider);
    return (0, _possibleConstructorReturn3.default)(this, (Provider.__proto__ || (0, _getPrototypeOf2.default)(Provider)).apply(this, arguments));
  }

  (0, _createClass3.default)(Provider, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        mContext.Provider,
        { value: this.props.store },
        this.props.children
      );
    }
  }]);
  return Provider;
}(_react.Component);