// @flow

import { type Action, createStore, createSubscriber } from 'react-adone';

type State = {
  count: number,
};

type Actions = typeof actions;

const initialState: State = {
  count: 0,
};

const actions = {
  increment: (): Action<State> => ({ setState, getState }) => {
    setState({
      count: getState().count + 1,
    });
  },
};

const Store = createStore<State, Actions>({ initialState, actions });

export const CountSubscriber = createSubscriber<State, typeof actions, {||}>(
  Store
);
