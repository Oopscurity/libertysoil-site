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
import classNames from 'classnames';
import omit from 'lodash/omit';

import { OldIcon as Icon } from '../../icon';

const STATUS_ICONS = {
  invalid: {
    className: 'color-red form__check',
    icon: 'minus'
  },
  valid: {
    className: 'color-green form__check',
    icon: 'check'
  },
  unfilled: {}
};

const DOT_ICON_SIZE = { outer: 'l', inner: 's' };

export default class FormField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    dotColor: PropTypes.string,
    error: PropTypes.string,
    name: PropTypes.string,
    refFn: PropTypes.func,
    statusIcon: PropTypes.shape({}),
    title: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ])
  };

  static defaultProps = {
    statusIcon: {},
    type: 'text'
  };

  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props;
  }

  render() {
    const { error, name, type, value } = this.props;

    let dotColor = 'gray', icon;
    if (error) {
      dotColor = 'red';
      icon = 'invalid';
    } else if (value) {
      icon = 'valid';
    } else {
      icon = 'unfilled';
    }

    if (this.props.dotColor) {
      dotColor = this.props.dotColor;
    }

    const cn = classNames(
      'form__row form__background--bright',
      this.props.className,
      {
        'form__field--checkbox': type === 'checkbox'
      }
    );

    const label = (
      <label className="form__label" htmlFor={name}>
        {this.props.title}
      </label>
    );

    const dot = (
      <Icon
        className="form__dot"
        color={dotColor}
        icon="fiber-manual-record"
        size={DOT_ICON_SIZE}
      />
    );

    const input = (
      <input
        className="form__input river-item bio__post--type_text input-transparent"
        id={name}
        name={name}
        ref={this.props.refFn}
        type={type}
        value={value}
        {...omit(this.props, KNOWN_PROPS)}
      />
    );

    const status = (
      <Icon
        className="form__check"
        size="common"
        {...STATUS_ICONS[icon]}
        {...this.props.statusIcon}
      />
    );

    let body;

    switch (type) {
      case 'checkbox': {
        body = (
          <div>
            <div className="layout layout-align_vertical">
              {dot}{input}{label}{status}
            </div>
          </div>
        );

        break;
      }
      default:
        body = (
          <div>
            {label}
            <div className="layout layout-align_vertical">
              {dot}{input}{status}
            </div>
          </div>
        );
    }

    return (
      <div className={cn} key={name}>
        {body}
        {error &&
          <div className="form__field-message">
            {error}
          </div>
        }
      </div>
    );
  }
}

const KNOWN_PROPS = Object.keys(FormField.propTypes);
