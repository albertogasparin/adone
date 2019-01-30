import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider, readContext } from '../context';
import BasketRegistry from '../registry';
import shallowEqual from '../utils/shallow-equal';

export default class Container extends Component {
  static propTypes = {
    children: PropTypes.node,
    scope: PropTypes.string,
    isGlobal: PropTypes.bool,
    actionExtraArgument: PropTypes.object,
    variables: PropTypes.object,
  };

  static basketType = null;

  static getDerivedStateFromProps(nextProps, prevState) {
    // we trigger store updates during this phase to avoid double rendering:
    // container gets fresh props, notifies subscribers which will setState
    // but as a render will already happen, we enjoy the batched update
    const { basketType, api, scopedBasketInitialized } = prevState;
    const { scope, variables } = nextProps;
    // we explicitly pass scope as it might be changed
    const { store } = api.getBasket(basketType, scope);
    const isInitialized = scopedBasketInitialized[store.key];
    const method = !isInitialized ? 'onContainerInit' : 'onContainerUpdate';

    if (basketType[method]) {
      const currentStoreState = store.getState();
      const result = basketType[method](currentStoreState, variables);
      store.mutator._action = method; // used for better debugging
      const nextStoreState = store.mutator(result);
      // check if store is different here as cheaper than checking in every subscriber
      if (nextStoreState && !shallowEqual(currentStoreState, nextStoreState)) {
        store.setState(nextStoreState);
      }
    }
    // after first call we mark the store as initialized
    scopedBasketInitialized[store.key] = true;
    return null;
  }

  constructor(props) {
    super(props);
    const ctx = readContext();
    const extraArg = Object.assign(
      {},
      ctx.globalRegistry.actionExtraArgument,
      props.actionExtraArgument
    );
    this.registry = new BasketRegistry('__local__');
    this.registry.configure({
      actionExtraArgument: extraArg,
    });

    this.state = {
      api: {
        globalRegistry: ctx.globalRegistry,
        getBasket: (basket, scope) =>
          this.getScopedBasket(basket, scope) || ctx.getBasket(basket),
      },
      // stored to make them available in getDerivedStateFromProps
      // as js context there is null https://github.com/facebook/react/issues/12612
      basketType: this.constructor.basketType,
      scopedBasketInitialized: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.scope !== prevProps.scope) {
      this.deleteScopedBasket(prevProps.scope);
    }
  }

  componentWillUnmount() {
    this.deleteScopedBasket();
  }

  getRegistry() {
    const isLocal = !this.props.scope && !this.props.isGlobal;
    return isLocal ? this.registry : this.state.api.globalRegistry;
  }

  getScopedBasket(basket, scopeId = this.props.scope) {
    const { basketType } = this.state;
    return basket === basketType
      ? this.getRegistry().getBasket(basket, scopeId)
      : null;
  }

  deleteScopedBasket(scopeId = this.props.scope) {
    const { basketType } = this.state;
    const { store } = this.getScopedBasket(basketType, scopeId);
    if (!store.listeners().length) {
      this.getRegistry().deleteBasket(basketType, scopeId);
    }
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state.api}>{children}</Provider>;
  }
}
