import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider } from '../context';
import BasketRegistry from '../registry';

export default class AdoneProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    initialStates: PropTypes.object,
  };

  static defaultProps = {
    initialStates: {},
  };

  constructor(props) {
    super(props);
    this.registry = new BasketRegistry();
    this.registry.configure({
      initialStates: props.initialStates,
    });
    this.state = {
      globalRegistry: this.registry,
      getBasket: this.registry.getBasket,
    };
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}
