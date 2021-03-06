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
import PropTypes from 'prop-types';

import React from 'react';
import { truncate } from 'grapheme-utils';
import omit from 'lodash/omit';

const RawTagName = ({ collapsed, truncated, name, ...props }) => {
  if (!name || collapsed) {
    return false;
  }

  let n = name;
  if (truncated) {
    n = truncate(n, { length: 16 });
  }

  if (n) {
    return (
      <div {...omit(props, ['children'])}>
        {n}
      </div>
    );
  }

  return false;
};

RawTagName.propTypes = {
  collapsed: PropTypes.bool,
  name: PropTypes.string,
  truncated: PropTypes.bool
};

PropTypes.defaultProps = {
  collapsed: false,
  name: '',
  truncated: false
};

export default RawTagName;
