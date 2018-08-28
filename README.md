# Renaox

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/renaox.svg?style=flat-square
[npm-url]: https://npmjs.org/package/renaox
[download-image]: https://img.shields.io/npm/dm/renaox.svg?style=flat-square
[download-url]: https://npmjs.org/package/renaox

### 为啥会写这么一个库？

emmm...其实刚入门 react 的时候 接触的 redux，深受繁琐的毒害后就写了这么一个库，现在已经替换掉项目中的 redux，目前只支持 react16+，因为依赖了 react 新的 context Api

### 特点

- 支持中间件
- 中大型项目可多个 contro 区分模块
- async 自带 loading
- orm 方法自带 SCU
- 性能好

### 安装

```bash
npm i -S renaox
or
yarn add renaox
```

## 例子

### 一个 Contro 的时候

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Store, Provider, orm } from 'renaox';

const Count = ({ loading, count, addCount, asyncAddCount, subtractCount }) => {
  return (
    <div>
      <div>count : {loading ? 'loading...' : count}</div>
      <button disabled={loading} onClick={addCount}>
        count + 1
      </button>
      <button disabled={loading} onClick={asyncAddCount}>
        async count + 1
      </button>
      <button disabled={loading} onClick={subtractCount}>
        count - 1
      </button>
    </div>
  );
};

const mapState = state => ({
  count: state.count,
  loading: state.loading.asyncAddCount, //当使用async后自动生成的loading   loading.xxxName
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
    async asyncAddCount(payload, rootState) {
      const c = await new Promise(resolve => {
        setTimeout(() => {
          resolve(1);
        }, 2000);
      });
      this.addCount(c);
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

## 开源协议

MIT
