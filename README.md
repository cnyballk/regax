# Renaox

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/renaox.svg?style=flat-square
[npm-url]: https://npmjs.org/package/renaox
[download-image]: https://img.shields.io/npm/dm/renaox.svg?style=flat-square
[download-url]: https://npmjs.org/package/renaox

a boring state management

> v1.1.1 提供一个 asyncs 的 loading 名字是 async 方法名字＋ Loading

## Install

```bash
npm i -S renaox
or
yarn add renaox
```

## Example

### 一个 Contro 的时候

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Store, Provider, orm } from 'renaox';

const Count = props => {
  return (
    <div>
      <div>count : {props.loading ? 'loading...' : props.count}</div>
      <button onClick={props.addCount}>count + 1</button>
      <button onClick={props.asyncAddCount}>async count + 1</button>
      <button onClick={props.subtractCount}>count - 1</button>
    </div>
  );
};

const mapState = state => ({
  count: state.count,
  loading: state.asyncAddCountLoading, //自动生成的loading  asyncAddCount + Loading
});

const mapMethods = methods => ({
  addCount: () => methods.addCount(1),
  subtractCount: methods.subtractCount,
  asyncAddCount: methods.asyncAddCount,
});

const CountContainer = orm(mapState, mapMethods)(Count);

const state = {
  count: 0,
};

const methods = {
  syncs: {
    addCount(state, payload) {
      state.count = state.count + payload;
    },
    subtractCount(state, payload) {
      state.count = state.count - 1;
    },
  },
  asyncs: {
    asyncAddCount(payload, rootState, end) {
      setTimeout(() => {
        this.addCount(1);
        end(); //通知结束loading  如果不需要loading则可以不用
      }, 1e3);
    },
  },
};
//一个打印state改变前后的log中间件
const log = store => fn => next => payload => {
  console.group('改变前：', store.state);
  next(fn, payload);
  console.log('改变后：', store.state);
  console.groupEnd();
};
const store = new Store({ state, methods }, [log]);

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
);
```

### 多个 Contro 的时候

当稍大的项目就需要分层 则可以使用多个 Contro

```js
///略
const mapState = state => ({
  countA: state.controA.count,
  countB: state.controB.count,
});
///略

const controA = {
  state: { count: 0 },
};
const controB = {
  state: { count: 0 },
};

const store = new Store({ controA, controB });
```
