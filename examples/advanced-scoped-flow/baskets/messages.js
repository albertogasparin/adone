// @flow

import { createComponents, type BasketAction } from 'react-adone';

type State = {
  data: string[],
  loading: boolean,
};

const initialState: State = {
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

const { Subscriber: MessagesSubscriber } = createComponents<
  State,
  typeof actions
>({
  name: 'messages',
  initialState,
  actions,
});

export { MessagesSubscriber };
