import React, { Component, createContext } from 'react';
import produce from 'immer';
//////////////////// util
const toType = obj => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};
const mContext = createContext();
////////////////////////////////////////////////////////////////

//////////////// Store
export class Store {
  constructor({ state, contros }) {
    this.state = state;
    this.contros = this.notify(contros);
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
  notify(contros) {
    let c = {};
    for (let contro in contros) {
      c[contro] = () => {
        const newState = produce(contros[contro])(this.state);
        this.state = newState;
        this.listeners.forEach(fn => fn());
        console.log(this.state);
      };
    }
    return c;
  }
}
////////////////////////////////////////////////////////////////

//////////////// Hoc orm  ===>  {state,contro}
export const orm = (mapState, mapNotify) => WarpperComponent =>
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
      const controToProps = mapNotify(context.contros);
      return {
        ...stateToProps,
        ...controToProps,
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
