//////////////////// util
export const isEmptyArray = arr => {
  return isArray(arr) ? arr.length === 0 : true;
};
export const toType = obj => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};
export const isArray = x => {
  return toType(x) === 'array';
};
export const isPromise = (x = {}) => {
  return x.then && toType(x.then) === 'function';
};
export const breakUpContros = contros => {
  if (contros.state) {
    return { ...contros, state: { ...contros.state, loading: {} } };
  }
  const state = {},
    methods = {};
  Object.keys(contros).forEach(i => {
    state[i] = { ...contros[i].state, loading: {} } || { loading: {} };
    methods[i] = {};
    methods[i].syncs = contros[i].syncs || {};
    methods[i].asyncs = contros[i].asyncs || {};
  });
  return { state, methods };
};
////////////////////////////////////////////////////////////////
