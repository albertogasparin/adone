// @flow

import {
  createStore,
  createContainer,
  createSubscriber,
  type Action,
} from 'react-adone';

type State = {
  message: string,
  isValid: boolean,
  isSending: boolean,
  toUsers: number,
};

type Actions = typeof actions;

type ContainerProps = {|
  remoteUsers: number,
|};

const initialState: State = {
  message: '',
  isValid: false,
  isSending: false,
  toUsers: 0,
};

const actions = {
  input: (value: string): Action<State> => ({ setState }) => {
    setState({
      message: value,
      isValid: value.length > 0,
    });
  },

  send: (message: string): Action<State> => async ({ setState }) => {
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

const Store = createStore<State, Actions>({
  name: 'form',
  initialState,
  actions,
});

export const FormContainer = createContainer<*, *, ContainerProps>(Store, {
  onUpdate: () => ({ setState }, { remoteUsers }) => {
    setState({ toUsers: remoteUsers });
  },
});

export const FormSubscriber = createSubscriber<*, *>(Store);
