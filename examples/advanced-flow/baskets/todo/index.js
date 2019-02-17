// @flow

import { createComponents } from 'react-adone';
import type { State } from './types';

import * as actionDefs from './actions';

type Actions = typeof actionDefs;
type ContainerProps = {| selectedUser: string | null |};

const initialState: State = {
  data: null,
  loading: false,
};

export const {
  Container: TodoContainer,
  Subscriber: TodoSubscriber,
} = createComponents<State, Actions, ContainerProps>({
  initialState,
  actions: actionDefs,
  onContainerUpdate: () => ({ actions }, { selectedUser }) => {
    if (selectedUser) actions.load(selectedUser);
  },
});
