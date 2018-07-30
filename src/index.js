import React, { Component, createContext } from 'react';
import produce from 'immer';
const mContext = createContext();
//////////////////// util
// const toType = obj => {
//   return {}.toString
//     .call(obj)
//     .match(/\s([a-zA-Z]+)/)[1]
//     .toLowerCase();
// };
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
  constructor(contros) {
    const { state, methods } = breakUpContros(contros);
    console.log(state, methods);
    this.state = state;
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
      c[syncs] = () => {
        const newState = produce(methods.syncs[syncs]).bind(
          this,
          method ? that.state[method] : that.state
        )();
        method ? (that.state[method] = newState) : (this.state = newState);
        this.listeners.forEach(fn => fn());
      };
    }
    for (const async in methods.asyncs) {
      c[async] = () => {
        methods.asyncs[async].bind(
          method ? this.methods[method] : this.methods,
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
