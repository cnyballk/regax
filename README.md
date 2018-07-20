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
import { Store } from 'renaox';
function Count(props) {
  return (
    <div>
      <div>count : {props.count}</div>
      <button onClick={props.addCount}>count + 1</button>
      <button onClick={props.subtractCount}>count - 1</button>
    </div>
  );
}
const state = {
  count: 0,
};
const contros = {
  addCount(state) {
    return { ...state, count: state.count + 1 };
  },
  subtractCount(state) {
    return { ...state, count: state.count - 1 };
  },
};
const store = new Store({ state, contros });

store.listen(update);

function update() {
  ReactDOM.render(
    <Count
      count={store.state.count}
      addCount={store.notify('addCount')}
      subtractCount={store.notify('subtractCount')}
    />,
    document.getElementById('root')
  );
}
update();
```
