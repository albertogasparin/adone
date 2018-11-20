// @flow

import { type BasketAction, createComponents } from 'react-adone';

type State = {
  count: number,
};

const defaultState: State = {
  count: 0,
};

const actions = {
  increment: (): BasketAction<State> => (setState, getState) => {
    setState({
      count: getState().count + 1,
    });
  },
};

const { Yield: CountYield } = createComponents({
  defaultState,
  actions,
});

export { CountYield };
