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
import { Link } from 'react-router';

import { API_HOST } from '../config';
import { URL_NAMES, getUrl } from '../utils/urlGenerator';

import Dropdown from './dropdown';
import User from './user';

const AuthBlock = ({ current_user, is_logged_in }) => {
  if (is_logged_in) {
    const logoutUrl = '/api/v1/logout';

    return (
      <div className="header__toolbar">
        <div className="header__toolbar_item">
          <User avatar={{ isRound: true }} text={{ hide: true }} user={current_user.user} />
          <Dropdown>
            <Link className="menu__item" to={getUrl(URL_NAMES.SETTINGS)}>Profile settings</Link>
            <form action={`${API_HOST}${logoutUrl}`} className="menu__item" method="post">
              <button className="button button-transparent button-wide button-caption_left" type="submit">Log out</button>
            </form>
          </Dropdown>
        </div>
      </div>
    );
  }

  return (
    <div className="header__toolbar">
      <div className="header__toolbar_item">
        <Link className="header__toolbar_item" to="/auth">Login</Link>
      </div>
    </div>
  );
};

AuthBlock.displayName = 'AuthBlock';

AuthBlock.propTypes = {
  current_user: PropTypes.shape({
    user: PropTypes.shape({})
  }),
  is_logged_in: PropTypes.bool
};

export default AuthBlock;
