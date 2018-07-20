import React, { Component, createContext } from 'react';
//////////////////// util
const toType = obj => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};
// import { toType } from './util/index.js';
const Context = createContext();

//////////////// Store
export class Store {
  constructor({ state, contros }) {
    this.state = state;
    this.contros = contros;
    this.listeners = [];
  }
  listen(listener) {
    return this.listeners.push(listener);
  }
  getState() {
    return this.state;
  }
  notify(contro) {
    return () => {
      const newState = this.contros[contro](this.state);
      if (toType(newState) !== 'object')
        throw Error('Hey,Brother, please return an object');
      this.state = newState;
      this.listeners.forEach(fn => fn());
    };
  }
}
////////////////////////////////////////////////

////////////////Provider
export class Provider extends Component {
  render() {
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
////////////////////////////////////////////////
