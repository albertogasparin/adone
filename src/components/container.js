import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider, readContext } from '../context';
import BasketRegistry from '../registry';

export default class Container extends Component {
  static propTypes = {
    children: PropTypes.node,
    scope: PropTypes.string,
    global: PropTypes.bool,
    actionExtraArgument: PropTypes.object,
  };

  static basketType = null;

  constructor(props) {
    super(props);
    const ctx = readContext();
    const extraArg = Object.assign(
      {},
      ctx.globalRegistry.actionExtraArgument,
      props.actionExtraArgument
    );
    this.registry = new BasketRegistry();
    this.registry.configure({
      actionExtraArgument: extraArg,
    });

    this.state = {
      globalRegistry: ctx.globalRegistry,
      getBasket: basket =>
        this.getScopedBasket(basket) || ctx.getBasket(basket),
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
    const isLocal = !this.props.scope && !this.props.global;
    return isLocal ? this.registry : this.state.globalRegistry;
  }

  getScopedBasket(basket, scopeId = this.props.scope) {
    const { basketType } = this.constructor;
    return basket === basketType
      ? this.getRegistry().getBasket(basket, scopeId || '__local__')
      : null;
  }

  deleteScopedBasket(scopeId = this.props.scope) {
    const { basketType } = this.constructor;
    const { store } = this.getScopedBasket(basketType, scopeId);
    if (!store.listeners().length) {
      this.getRegistry().deleteBasket(basketType, scopeId);
    }
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}
