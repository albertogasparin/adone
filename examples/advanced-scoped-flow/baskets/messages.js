// @flow

import { createComponents, type BasketAction } from 'react-adone';

type State = {
  data: string[],
  loading: boolean,
};

const defaultState: State = {
  data: [],
  loading: false,
};

const actions = {
  add: (message: string): BasketAction<State> => (setState, getState) => {
    setState({
      data: [...getState().data, message],
    });
  },
};

const { Subscriber: MessagesYield } = createComponents({
  name: 'messages',
  defaultState,
  actions,
});

export { MessagesYield };
