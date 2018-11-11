import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider, readContext } from './context';
import BasketRegistry from './registry';

export default class YieldScope extends Component {
  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    for: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object),
    ]).isRequired,
    local: PropTypes.bool,
    actionExtraArgument: PropTypes.object,
  };

  static defaultProps = {
    id: '',
    local: false,
  };

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
    if (this.props.id !== prevProps.id) {
      this.deleteScopedBaskets(prevProps.id);
    }
  }

  componentWillUnmount() {
    this.deleteScopedBaskets();
  }

  getRegistry() {
    const isLocal = this.props.local || !this.props.id;
    return isLocal ? this.registry : this.state.globalRegistry;
  }

  getScopedBasket(basket, scopeId = this.props.id) {
    const scopedBaskets = [].concat(this.props.for);
    if (!scopedBaskets.includes(basket)) {
      return null;
    }
    return this.getRegistry().getBasket(basket, scopeId || 'local');
  }

  deleteScopedBaskets(scopeId = this.props.id) {
    [].concat(this.props.for).forEach(basket => {
      const { store } = this.getScopedBasket(basket, scopeId);
      if (!store.listeners().length) {
        this.getRegistry().deleteBasket(basket, scopeId);
      }
    });
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}
