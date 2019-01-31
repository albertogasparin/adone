// @flow

import { createComponents } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';

const initialState: State = {
  data: null,
  loading: false,
};

const { Subscriber: TodoSubscriber } = createComponents<State, typeof actions>({
  initialState,
  actions,
});

export { TodoSubscriber };
