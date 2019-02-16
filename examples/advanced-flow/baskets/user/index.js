// @flow

import { createComponents, createSelector } from 'react-adone';
import type { State } from './types';

import * as actionDefs from './actions';
import * as selectors from './selectors';

type Actions = typeof actionDefs;
type ContainerProps = {||};

const initialState: State = {
  selected: null,
  data: null,
  loading: false,
};

export const {
  Container: UserContainer,
  Subscriber: UserSubscriber,
} = createComponents<State, Actions, ContainerProps>({
  initialState,
  actions: actionDefs,
  onContainerInit: () => ({ actions }) => actions.load(),
});

export const UserSelectedSubscriber = createSelector<
  $Call<typeof selectors.getSelected, State>,
  Actions
>(
  UserSubscriber,
  selectors.getSelected
);
