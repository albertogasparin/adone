import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider, readContext } from '../context';
import BasketRegistry from '../registry';
import shallowEqual from '../utils/shallow-equal';
import bindActions from '../bind-actions';

export default class Container extends Component {
  static propTypes = {
    children: PropTypes.node,
    scope: PropTypes.string,
    isGlobal: PropTypes.bool,
  };

  static basketType = null;

  static getDerivedStateFromProps(nextProps, prevState) {
    // we trigger store updates during this phase to avoid double rendering:
    // container gets fresh props, notifies subscribers which will setState
    // but as a render will already happen, we enjoy the batched update
    const { basketType, api, getContainerProps } = prevState;
    const { scope } = nextProps;
    // we explicitly pass scope as it might be changed
    const { store } = api.getBasket(basketType, scope);
    const isInitialized = prevState.scope === scope;
    const method = !isInitialized ? 'onContainerInit' : 'onContainerUpdate';

    if (basketType[method]) {
      const currentStoreState = store.getState();
      const result = basketType[method](
        currentStoreState,
        getContainerProps(nextProps)
      );
      store.mutator._action = method; // used for better debugging
      const nextStoreState = store.mutator(result);
      // check if store is different here as cheaper than checking in every subscriber
      if (nextStoreState && !shallowEqual(currentStoreState, nextStoreState)) {
        store.setState(nextStoreState);
      }
    }
    // after first call we mark the store as initialized
    if (!isInitialized) {
      return {
        scope,
        scopedBasketActions: bindActions(
          basketType.actions,
          store,
          getContainerProps
        ),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const ctx = readContext();
    this.registry = new BasketRegistry('__local__');

    this.state = {
      api: {
        globalRegistry: ctx.globalRegistry,
        getBasket: (basket, scope) =>
          this.getScopedBasket(basket, scope) || ctx.getBasket(basket),
      },
      // stored to make them available in getDerivedStateFromProps
      // as js context there is null https://github.com/facebook/react/issues/12612
      basketType: this.constructor.basketType,
      getContainerProps: this.getContainerProps,
      scope: null,
      scopedBasketActions: null,
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

  getContainerProps = (props = this.props) => {
    // eslint-disable-next-line no-unused-vars
    const { children, scope, isGlobal, ...restProps } = props;
    return restProps;
  };

  getRegistry() {
    const isLocal = !this.props.scope && !this.props.isGlobal;
    return isLocal ? this.registry : this.state.api.globalRegistry;
  }

  getScopedBasket(basket, scopeId = this.props.scope) {
    const { basketType } = this.state;
    if (basket !== basketType) {
      return null;
    }
    const { store } = this.getRegistry().getBasket(basket, scopeId);
    // instead of returning global bound actions
    // we return the ones with the countainer props binding
    return {
      store,
      actions: this.state.scopedBasketActions,
    };
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
