/*
 This file is a part of libertysoil.org website
 Copyright (C) 2017  Loki Education (Social Enterprise)

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import { browserHistory, createMemoryHistory } from 'react-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import getRouteFor from '../../selectors/contextual-routes';
import Login from './wrappers/login';
import Register from './wrappers/register';

const closeRoute = (location) => ({
  ...location,
  query: omit(location.query, ['route'])
});

const onClose = (() => {
  if (browserHistory) {
    return Object.assign(
      () => {
        const location = browserHistory.getCurrentLocation();
        browserHistory.push(closeRoute(location));
      },
      { to: closeRoute }
    );
  }

  return Object.assign(
    () => {
      const history = createMemoryHistory();
      const location = history.getCurrentLocation();
      history.push(closeRoute(location));
    },
    { to: closeRoute }
  );
})();

const pobj = {};

const ANIMATION_PROPS = {
  appear: true,
  classNames: 'sidebar-modal__overlay--transition',
  enter: false,
  exit: true,
  mountOnEnter: true,
  timeout: 250,
  unmountOnExit: true
};

const DEFAULT_COMPONENT = <div />;

export default class ContextualRoutes extends React.PureComponent {
  static propTypes = {
    location: PropTypes.shape(),
    only: PropTypes.arrayOf(PropTypes.string),
    predefProps: PropTypes.shape(),
    routes: PropTypes.arrayOf(PropTypes.shape()),
    scope: PropTypes.string
  };

  static defaultProps = {
    predefProps: {}
  };

  componentWillUpdate(nextProps) {
    const { route: nextRoute } = nextProps.location.query;
    const { route: prevRoute } = this.props.location.query;
    if (nextRoute !== prevRoute) {
      const nextRouteType = typeof nextRoute;
      const prevRouteType = typeof prevRoute;
      if (nextRouteType === prevRouteType) {
        if (nextRouteType === 'string') {
          this.addRoute(nextRoute);
        } else if (Array.isArray(nextRoute)) {
          this.addRoutes(nextRoute);
        }
      }
    }
  }

  addRoute(routeName) {
    const i = this.renderedRoutes.indexOf(routeName);
    if (i >= 0) {
      this.renderedRoutes.splice(i, 1);
    }
    this.renderedRoutes.push(routeName);
  }

  renderedRoutes = [];

  render() {
    const routeName = getRouteFor(this.props)(this.props.scope);

    let restProps = pobj;

    if (routeName) {
      const { only } = this.props;
      if (only && !only.includes(routeName)) {
        return false;
      }

      const { predefProps } = this.props;

      if (routeName in predefProps) {
        restProps = predefProps[routeName];
      }
    }

    let Component, isVisible;

    switch (routeName) {
      case 'login': {
        isVisible = true;
        Component = props => (
          <Login
            key="login"
            isVisible
            onClose={onClose}
            {...omit(this.props, KNOWN_PROPS)}
            {...restProps}
            {...props}
          />
        );

        break;
      }
      case 'signup': {
        isVisible = true;
        Component = (props) => (
          <Register
            key="signup"
            isVisible
            onClose={onClose}
            {...omit(this.props, KNOWN_PROPS)}
            {...restProps}
            {...props}
          />
        );

        break;
      }
      default: {
        isVisible = false;
        Component = () => DEFAULT_COMPONENT;
      }
    }

    return (
      <CSSTransition
        in={isVisible}
        {...ANIMATION_PROPS}
      >
        {(state) => <Component state={state} />}
      </CSSTransition>
    );
  }
}

const KNOWN_PROPS = Object.keys(ContextualRoutes.propTypes);
