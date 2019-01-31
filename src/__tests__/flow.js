// @flow
/* eslint-disable no-unused-vars, react/display-name */
import React from 'react';
import {
  AdoneProvider,
  createComponents,
  createSelector,
  type BasketAction,
  type Basket,
} from '..';

/**
 * Basket types tests
 */
type State = {| count: number |};
type ExtraArg = {| api: () => void |};

let Test;
let Cc;
let TypeSelector;
let basket: Basket<State, typeof actions>;

const actions = {
  // setState tests
  increment: (n: number): BasketAction<State> => setState => {
    // $ExpectError setState should be of type State
    setState('');

    // $ExpectError Partial state should be of type State
    setState({
      foo: 1,
    });

    // correct
    setState({
      count: 2,
    });
  },

  // GetState tests
  decrement: (): BasketAction<State> => (setState, getState) => {
    const state = getState();
    // $ExpectError State should be of type State
    const bla = state.bla;
    // $ExpectError State should not be considered writable
    state.count = 1;

    // correct
    const { count } = state;
  },

  // actionExtraArgument tests
  double: (): BasketAction<State, ExtraArg> => (
    setState,
    getState,
    extraArg
  ) => {
    // $ExpectError extraArg should be of type ExtraArg
    const bla = extraArg.bla;

    // Correct
    const { api } = extraArg;
  },
};

// $ExpectError Basket should have key of type string
basket = { key: 1, initialState: { count: 0 }, actions };

// $ExpectError Basket should have initialState of type state
basket = { key: 'bla', initialState: { bla: 0 }, actions };

// $ExpectError Basket should have initialState of type state
basket = { key: 'bla', initialState: { count: 0 } };

// $ExpectError Basket should have actions
basket = { key: 'bla', initialState: { count: 0 } };

// Correct
basket = { key: ['bla'], initialState: { count: 0 }, actions };

/**
 * createComponents types tests
 */
Cc = createComponents<State, typeof actions>({
  name: 'Type',
  initialState: { count: 0 },
  actions,
});

Test = (
  // $ExpectError Child arg shape should be state + actions
  <Cc.Subscriber>{({ foo }) => foo}</Cc.Subscriber>
);

Test = (
  // $ExpectError Basket actions should be correcly typed
  <Cc.Subscriber>{({ increment }) => increment()}</Cc.Subscriber>
);

Test = (
  // $ExpectError Basket state should be read only
  <Cc.Subscriber>{state => (state.count = 1)}</Cc.Subscriber>
);

// Correct
Test = <Cc.Subscriber>{({ count }) => count + 0}</Cc.Subscriber>;
Test = <Cc.Subscriber>{({ increment }) => increment(1)}</Cc.Subscriber>;

/**
 * createSelector types tests
 */
TypeSelector = createSelector<{ baz: number }, typeof actions>(
  Cc.Subscriber,
  () => ({ baz: 1 })
);

Test = (
  // $ExpectError Child arg shape should be pick + actions
  <TypeSelector>{({ count }) => count}</TypeSelector>
);

// Correct
Test = <TypeSelector>{({ baz }) => baz}</TypeSelector>;
Test = <TypeSelector>{({ increment }) => increment(1)}</TypeSelector>;

TypeSelector = createSelector<typeof actions>(
  Cc.Subscriber,
  null
);

Test = (
  // $ExpectError Child arg shape should be just actions
  <TypeSelector>{({ count }) => count}</TypeSelector>
);

// Correct
Test = <TypeSelector>{({ increment }) => increment(1)}</TypeSelector>;

/**
 * Container types tests
 */

// Correct
Test = <Cc.Container id="a">bla</Cc.Container>;
Test = <Cc.Container>bla</Cc.Container>;
Test = (
  <Cc.Container id="a" actionExtraArgument={{ url: '' }}>
    bla
  </Cc.Container>
);

/**
 * AdoneProvider types tests
 */
Test = (
  // $ExpectError initialStates should be an object
  <AdoneProvider initialStates={null}>bla</AdoneProvider>
);

// Correct
Test = <AdoneProvider initialStates={{ k: {} }}>bla</AdoneProvider>;
Test = <AdoneProvider actionExtraArgument={{ url: '' }}>bla</AdoneProvider>;
