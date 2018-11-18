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
  input: (value: string): BasketAction<State> => setState => {
    setState({
      message: value,
      isValid: value.length > 0,
    });
  },

  send: (message: string): BasketAction<State> => async setState => {
    setState({
      isSending: true,
    });
    await new Promise(r => setTimeout(r, 1000));
    setState({
      isSending: false,
      message: '',
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
