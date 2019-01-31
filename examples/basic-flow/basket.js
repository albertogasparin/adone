// @flow

import { type BasketAction, createComponents } from 'react-adone';

type State = {
  count: number,
};

const initialState: State = {
  count: 0,
};

const actions = {
  increment: (): BasketAction<State> => (setState, getState) => {
    setState({
      count: getState().count + 1,
    });
  },
};

const { Subscriber: CountSubscriber } = createComponents<State, typeof actions>(
  {
    initialState,
    actions,
  }
);

export { CountSubscriber };
