import produce from 'immer';
import { breakUpContros, isEmptyArray } from './util';

//////////////// Store
export default class Store {
  constructor(contros, middlewares) {
    const { state, methods } = breakUpContros(contros);
    console.log(state, methods);
    this.state = state;
    this.middlewares = isEmptyArray(middlewares) ? false : middlewares;
    // //绑定中间件
    // this.bindMiddlewares =
    //   this.middlewares &&
    //   this.middlewares.map(fn => fn(this)).reduce((a, b) => p => a(b(p)));
    // 绑定方法
    this.methods = this.notify(methods);
    this.listeners = [];
  }
  listen(listener) {
    this.listeners.push(listener);
  }
  unListen(listener) {
    this.listeners = this.listeners.filter(fn => fn !== listener);
  }
  getState() {
    return this.state;
  }
  _toggleLoading(async, method, bool) {
    if (this.state[async + 'Loading'] && bool) return; //如果不使用则只调用一次 避免重复渲染
    const newState = produce(state => {
      state[async + 'Loading'] = bool;
    }).bind(this, method ? this.state[method] : this.state)();
    method ? (this.state[method] = newState) : (this.state = newState);
    this.listeners.forEach(fn => fn());
  }
  bindMethods(methods, method) {
    const c = {};
    const that = this;

    for (const syncs in methods.syncs) {
      this.bindMiddlewares =
        this.middlewares &&
        this.middlewares
          .map(fn => fn(this))
          .map(fn => fn(methods.syncs[syncs]))
          .reduce((a, b) => p => a(b(p)));
      // 留存next函数
      const next = (sync, payload) => {
        const newState = produce(sync).bind(
          this,
          method ? that.state[method] : that.state
        )(payload);
        method ? (that.state[method] = newState) : (this.state = newState);

        this.listeners.forEach(fn => fn());
      };
      // 使用中间件
      c[syncs] = this.bindMiddlewares ? this.bindMiddlewares(next) : next;
    }

    for (const async in methods.asyncs) {
      c[async] = payload => {
        this._toggleLoading(async, method, true);
        return methods.asyncs[async].bind(
          method ? this.methods[method] : this.methods,
          payload,
          this.state,
          this._toggleLoading.bind(this, async, method, false)
        )();
      };
    }
    return c;
  }
  notify(methods) {
    let c = {};
    if (methods.syncs) {
      c = this.bindMethods(methods);
    } else {
      for (const method in methods) {
        c[method] = this.bindMethods(methods[method], method);
      }
    }
    return c;
  }
}
////////////////////////////////////////////////////////////////
