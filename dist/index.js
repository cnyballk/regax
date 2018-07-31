'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.orm = exports.Store = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mContext = (0, _react.createContext)();
//////////////////// util
// const toType = obj => {
//   return {}.toString
//     .call(obj)
//     .match(/\s([a-zA-Z]+)/)[1]
//     .toLowerCase();
// };
var breakUpContros = function breakUpContros(contros) {
  if (contros.state) {
    return contros;
  }
  var state = {},
      methods = {};
  (0, _keys2.default)(contros).forEach(function (i) {
    state[i] = contros[i].state || {};
    methods[i] = {};
    methods[i].syncs = contros[i].syncs || {};
    methods[i].asyncs = contros[i].asyncs || {};
  });
  return { state: state, methods: methods };
};
////////////////////////////////////////////////////////////////

//////////////// Store

var Store = exports.Store = function () {
  function Store(contros) {
    (0, _classCallCheck3.default)(this, Store);

    var _breakUpContros = breakUpContros(contros),
        state = _breakUpContros.state,
        methods = _breakUpContros.methods;

    console.log(state, methods);
    this.state = state;
    this.methods = this.notify(methods);
    this.listeners = [];
  }

  (0, _createClass3.default)(Store, [{
    key: 'listen',
    value: function listen(listener) {
      return this.listeners.push(listener);
    }
  }, {
    key: 'unListen',
    value: function unListen(listener) {
      return this.listeners.filter(function (fn) {
        return fn !== listener;
      });
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }
  }, {
    key: 'bindMethods',
    value: function bindMethods(methods, method) {
      var _this = this;

      var c = {};
      var that = this;

      var _loop = function _loop(syncs) {
        c[syncs] = function (payload) {
          var newState = (0, _immer2.default)(methods.syncs[syncs]).bind(_this, method ? that.state[method] : that.state)(payload);
          method ? that.state[method] = newState : _this.state = newState;
          _this.listeners.forEach(function (fn) {
            return fn();
          });
        };
      };

      for (var syncs in methods.syncs) {
        _loop(syncs);
      }

      var _loop2 = function _loop2(async) {
        c[async] = function (payload) {
          methods.asyncs[async].bind(method ? _this.methods[method] : _this.methods, payload, _this.state)();
          _this.listeners.forEach(function (fn) {
            return fn();
          });
        };
      };

      for (var async in methods.asyncs) {
        _loop2(async);
      }
      return c;
    }
  }, {
    key: 'notify',
    value: function notify(methods) {
      var c = {};
      if (methods.syncs) {
        c = this.bindMethods(methods);
      } else {
        for (var method in methods) {
          c[method] = this.bindMethods(methods[method], method);
        }
      }
      return c;
    }
  }]);
  return Store;
}();
////////////////////////////////////////////////////////////////

//////////////// Hoc orm  ===>  {state,contro}


var orm = exports.orm = function orm(mapState, mapMethods) {
  return function (WarpperComponent) {
    return function (_Component) {
      (0, _inherits3.default)(_class, _Component);

      function _class(props) {
        (0, _classCallCheck3.default)(this, _class);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this, props));

        _this2._isMounted = false;
        _this2.state = {};
        _this2._listen = _this2._listen.bind(_this2);
        _this2.updata = _this2.updata.bind(_this2);
        return _this2;
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
          var _this3 = this;

          return _react2.default.createElement(
            mContext.Consumer,
            null,
            function (context) {
              _this3.store = context;
              return _react2.default.createElement(WarpperComponent, _this3._listen(context));
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