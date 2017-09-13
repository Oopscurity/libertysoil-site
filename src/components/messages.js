/*
 This file is a part of libertysoil.org website
 Copyright (C) 2016  Loki Education (Social Enterprise)

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
import classNames from 'classnames';
import omit from 'lodash/omit';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { ArrayOfMessages as ArrayOfMessagesPropType } from '../prop-types/messages';

import Message from './message';

const DEFAULT_ANIMATION = {
  appear: true,
  classNames: 'form__message--transition',
  mountOnEnter: true,
  timeout: 250,
  unmountOnExit: true
};

export default class Messages extends React.PureComponent {
  static displayName = 'Messages';

  static propTypes = {
    animated: PropTypes.bool,
    animationProps: PropTypes.shape({}),
    className: PropTypes.string,
    innerProps: PropTypes.shape({}),
    messages: ArrayOfMessagesPropType.isRequired,
    removeMessage: PropTypes.func
  };

  static defaultProps = {
    animationProps: {},
    innerProps: {}
  };

  componentWillUpdate(nextProps) {
    this.restProps = omit(nextProps, KNOWN_PROPS);
  }

  restProps = {};

  render() {
    const { animated, messages } = this.props;
    if (!animated && messages.isEmpty()) {
      return false;
    }

    const { innerProps, removeMessage } = this.props;
    const children = messages.map(msg =>
      <Message
        i={msg.get('id')}
        key={msg.get('id')}
        message={msg.get('message')}
        removeMessage={removeMessage}
        type={msg.get('type')}
        {...innerProps}
      />
    );

    if (animated) {
      return (
        <div
          className={classNames('message__group', this.props.className)}
          {...this.restProps}
        >
          <TransitionGroup component="div">
            {children.map(element => (
              <CSSTransition
                key={element.props.key}
                {...DEFAULT_ANIMATION}
                {...this.props.animationProps}
              >
                {element}
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      );
    }

    return (
      <div
        className={classNames('message__group', this.props.className)}
        {...this.restProps}
      >
        {children}
      </div>
    );
  }
}

const KNOWN_PROPS = Object.keys(Messages.propTypes);
