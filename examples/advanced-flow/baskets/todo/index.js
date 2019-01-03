// @flow

import { createComponents } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';

const defaultState: State = {
  data: null,
  loading: false,
};

const { Subscriber: TodoSubscriber } = createComponents<State, typeof actions>({
  defaultState,
  actions,
});

export { TodoSubscriber };
