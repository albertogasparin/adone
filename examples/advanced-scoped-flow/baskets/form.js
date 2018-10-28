// @flow

import type { BasketAction } from 'react-adone';

type State = {
  message: string,
  isValid: boolean,
  isSending: boolean,
};

const defaultState: State = {
  message: '',
  isValid: false,
  isSending: false,
};

const actions = {
  input: (value: string): BasketAction<State> => produce => {
    produce(draft => {
      draft.message = value;
      draft.isValid = value.length > 0;
    });
  },

  send: (message: string): BasketAction<State> => async produce => {
    produce(draft => {
      draft.isSending = true;
    });
    await new Promise(r => setTimeout(r, 1000));
    produce(draft => {
      draft.isSending = false;
      draft.message = '';
    });
    return message;
  },
};

const basket = {
  key: 'form',
  defaultState,
  actions,
};

export default basket;
