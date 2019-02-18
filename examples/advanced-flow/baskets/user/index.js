// @flow

import { createStore, createContainer, createSubscriber } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';
import * as selectors from './selectors';

type Actions = typeof actions;
type ContainerProps = {||};
type UserSelectedState = $Call<typeof selectors.getSelected, State>;

const initialState: State = {
  selected: null,
  data: null,
  loading: false,
};

const Store = createStore<State, Actions>({
  initialState,
  actions,
});

export const UserContainer = createContainer<*, *, ContainerProps>(Store, {
  onInit: actions.load,
});

export const UserSubscriber = createSubscriber<*, *>(Store);

export const UserSelectedSubscriber = createSubscriber<*, *, UserSelectedState>(
  Store,
  {
    selector: selectors.getSelected,
  }
);
