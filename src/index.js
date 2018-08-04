import React, { Component, createContext } from 'react';
import produce from 'immer';
const mContext = createContext();
//////////////////// util
const isEmptyArray = arr => {
  return isArray(arr) ? arr.length === 0 : true;
};
const toType = obj => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};
const isArray = x => {
  return toType(x) === 'array';
};
const breakUpContros = contros => {
  if (contros.state) {
    return contros;
  }
  const state = {},
    methods = {};
  Object.keys(contros).forEach(i => {
    state[i] = contros[i].state || {};
    methods[i] = {};
    methods[i].syncs = contros[i].syncs || {};
    methods[i].asyncs = contros[i].asyncs || {};
  });
  return { state, methods };
};
////////////////////////////////////////////////////////////////

//////////////// Store
export class Store {
  constructor(contros, middlewares) {
    const { state, methods } = breakUpContros(contros);
    console.log(state, methods);
    this.state = state;
    this.middlewares = isEmptyArray(middlewares) ? false : middlewares;
    //绑定中间件
    this.bindMiddlewares =
      this.middlewares &&
      this.middlewares.map(fn => fn(this)).reduce((a, b) => p => a(b(p)));
    // 绑定方法
    this.methods = this.notify(methods);
    this.listeners = [];
  }
  listen(listener) {
    return this.listeners.push(listener);
  }
  unListen(listener) {
    return this.listeners.filter(fn => fn !== listener);
  }
  getState() {
    return this.state;
  }
  bindMethods(methods, method) {
    const c = {};
    const that = this;

    for (const syncs in methods.syncs) {
      // 留存next函数
      const next = payload => {
        const newState = produce(methods.syncs[syncs]).bind(
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
        methods.asyncs[async].bind(
          method ? this.methods[method] : this.methods,
          payload,
          this.state
        )();
        this.listeners.forEach(fn => fn());
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

//////////////// Hoc orm  ===>  {state,contro}
export const orm = (mapState, mapMethods) => WarpperComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this._isMounted = false;
      this.state = {};
      this._listen = this._listen.bind(this);
      this.updata = this.updata.bind(this);
    }
    componentDidMount() {
      this._isMounted = true;
      this.store.listen(this.updata);
    }
    componentWillUnmount() {
      this._isMounted = false;
      this.store.unListen(this.updata);
    }
    updata() {
      this.setState({});
    }
    _listen(context) {
      if (!context) throw Error('Please be wrapped in a <Provider/>');
      const stateToProps = mapState(context.state);
      const methodsToProps = mapMethods(context.methods);
      return {
        ...stateToProps,
        ...methodsToProps,
      };
    }
    render() {
      return (
        <mContext.Consumer>
          {context => {
            this.store = context;
            return <WarpperComponent {...this._listen(context)} />;
          }}
        </mContext.Consumer>
      );
    }
  };

////////////////////////////////////////////////

////////////////Provider
export class Provider extends Component {
  render() {
    return (
      <mContext.Provider value={this.props.store}>
        {this.props.children}
      </mContext.Provider>
    );
  }
}
