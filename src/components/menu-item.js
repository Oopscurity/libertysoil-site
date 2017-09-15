/*
 This file is a part of libertysoil.org website
 Copyright (C) 2015  Loki Education (Social Enterprise)

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

const MenuItem = (props) => {
  const cn = classNames('menu__item action', props.className);

  // TODO: check compatibility with JS disabled mode
  if (props.isOption) {
    return (
      <div
        className={cn}
        data-value={props.value}
        {...omit(props, KNOWN_PROPS)}
      />
    );
  }

  return <div className={cn} {...props} />;
};

MenuItem.propTypes = {
  className: PropTypes.string,
  isOption: PropTypes.bool,
  value: PropTypes.string
};

const KNOWN_PROPS = Object.keys(MenuItem.propTypes);

export default MenuItem;
