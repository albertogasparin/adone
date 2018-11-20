// @flow

import { createComponents } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';

const defaultState: State = {
  data: null,
  loading: false,
};

const { Yield: TodoYield } = createComponents({
  defaultState,
  actions,
});

export { TodoYield };
