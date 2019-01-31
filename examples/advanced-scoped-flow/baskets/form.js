// @flow

import { createComponents, type BasketAction } from 'react-adone';

type State = {
  message: string,
  isValid: boolean,
  isSending: boolean,
  toUsers: number,
};

const initialState: State = {
  message: '',
  isValid: false,
  isSending: false,
  toUsers: 0,
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

const {
  Subscriber: FormSubscriber,
  Container: FormContainer,
} = createComponents<State, typeof actions>({
  name: 'form',
  initialState,
  actions,
  onContainerUpdate: (state, variables) => {
    return { ...state, toUsers: variables.remoteUsers };
  },
});
export { FormSubscriber, FormContainer };
