// @flow

import { createComponents, createSelector } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';
import * as selectors from './selectors';

const initialState: State = {
  selected: null,
  data: null,
  loading: false,
};

const { Subscriber: UserSubscriber } = createComponents<State, typeof actions>({
  initialState,
  actions,
});

const UserSelectedSubscriber = createSelector<
  $Call<typeof selectors.getSelected, State>,
  typeof actions
>(
  UserSubscriber,
  selectors.getSelected
);

export { UserSubscriber, UserSelectedSubscriber };
