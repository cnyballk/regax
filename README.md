# Renaox

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/renaox.svg?style=flat-square
[npm-url]: https://npmjs.org/package/renaox
[download-image]: https://img.shields.io/npm/dm/renaox.svg?style=flat-square
[download-url]: https://npmjs.org/package/renaox

a boring state management

## Install

```bash
npm install --save renaox
```

## Example

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Store, Provider, orm } from 'renaox';
function Count(props) {
  return (
    <div>
      <div>count : {props.count}</div>
      <button onClick={props.addCount}>count + 1</button>
      <button onClick={props.subtractCount}>count - 1</button>
    </div>
  );
}

const mapState = state => ({
  count: state.count,
});
const mapContros = contros => ({
  addCount: contros.addCount,
  subtractCount: contros.subtractCount,
});
const CountContainer = orm(mapState, mapContros)(Count);

const state = {
  count: 0,
};
const contros = {
  addCount(state) {
    state.count = state.count + 1;
  },
  subtractCount(state) {
    state.count = state.count - 1;
  },
};
const store = new Store({ state, contros });
ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
);
```
