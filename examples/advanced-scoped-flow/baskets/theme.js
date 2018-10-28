// @flow

import type { BasketAction } from 'react-adone';

type State = {
  color: string,
};

const defaultState: State = {
  color: '#FFF',
};

const actions = {
  change: (value: string): BasketAction<State> => produce => {
    produce(draft => {
      draft.color = value;
    });
  },
};

export default {
  key: 'theme',
  defaultState,
  actions,
};
