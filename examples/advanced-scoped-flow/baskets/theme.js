// @flow

import { createComponents, type BasketAction } from 'react-adone';

type State = {
  color: string,
};

const defaultState: State = {
  color: '#FFF',
};

const actions = {
  change: (value: string): BasketAction<State> => setState => {
    setState({
      color: value,
    });
  },
};

const { Subscriber: ThemeYield, Scope: ThemeScope } = createComponents({
  name: 'theme',
  defaultState,
  actions,
});

export { ThemeYield, ThemeScope };
