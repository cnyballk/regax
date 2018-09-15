'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////// Store
var Store = function () {
  function Store(contros, middlewares) {
    (0, _classCallCheck3.default)(this, Store);

    var _breakUpContros = (0, _util.breakUpContros)(contros),
        state = _breakUpContros.state,
        methods = _breakUpContros.methods;

    this.state = state;
    this.middlewares = (0, _util.isEmptyArray)(middlewares) ? false : middlewares;
    // 绑定方法
    this.methods = this.notify(methods);
    this.listeners = [];
  }

  (0, _createClass3.default)(Store, [{
    key: 'listen',
    value: function listen(listener) {
      this.listeners.push(listener);
    }
  }, {
    key: 'unListen',
    value: function unListen(listener) {
      this.listeners = this.listeners.filter(function (fn) {
        return fn !== listener;
      });
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }
  }, {
    key: '_toggleLoading',
    value: function _toggleLoading(async, method, bool) {
      if (this.state['loading'][async] && bool) return; //如果不使用则只调用一次 避免重复渲染
      var newState = (0, _immer2.default)(function (state) {
        state['loading'][async] = bool;
      }).bind(this, method ? this.state[method] : this.state)();
      method ? this.state[method] = newState : this.state = newState;
      this.listeners.forEach(function (fn) {
        return fn();
      });
    }
  }, {
    key: 'bindMethods',
    value: function bindMethods(methods, method) {
      var _this = this;

      var c = {};
      var that = this;

      //同步
      for (var syncs in methods.syncs) {
        //绑定中间件
        this.bindMiddlewares = this.middlewares && this.middlewares.map(function (fn) {
          return fn(_this);
        }).reduce(function (a, b) {
          return function () {
            return a(b.apply(undefined, arguments));
          };
        });
        // 留存next函数
        var next = function next(sync, payload) {
          var newState = (0, _immer2.default)(sync).bind(_this, method ? that.state[method] : that.state)(payload);
          method ? that.state[method] = newState : _this.state = newState;

          _this.listeners.forEach(function (fn) {
            return fn();
          });
        };
        // 使用中间件
        c[syncs] = this.bindMiddlewares ? this.bindMiddlewares(next).bind(this, methods.syncs[syncs]) : next;
      }

      //异步

      var _loop = function _loop(async) {
        c[async] = function (payload) {
          var p = methods.asyncs[async].bind(method ? _this.methods[method] : _this.methods, payload, _this.state)();

          if ((0, _util.isPromise)(p)) {
            _this._toggleLoading(async, method, true);
            p.finally(function () {
              _this._toggleLoading(async, method, false);
            });
          }

          return p;
        };
      };

      for (var async in methods.asyncs) {
        _loop(async);
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


exports.default = Store;