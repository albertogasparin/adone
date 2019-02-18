// @flow

import { createStore, createSubscriber, type Action } from 'react-adone';

type State = {
  data: string[],
  loading: boolean,
};

type Actions = typeof actions;

const initialState: State = {
  data: [],
  loading: false,
};

const actions = {
  add: (message: string): Action<State> => ({ setState, getState }) => {
    setState({
      data: [...getState().data, message],
    });
  },
};

const Store = createStore<State, Actions>({
  name: 'messages',
  initialState,
  actions,
});

export const MessagesSubscriber = createSubscriber<*, *>(Store);
