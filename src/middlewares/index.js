import defaults from '../defaults';
import update from './update';

const applyMiddleware = (store, middlewares) =>
  [...middlewares, update]
    .reverse()
    .reduce((next, mw) => mw(store)(next), defaults.mutator);

export default applyMiddleware;
