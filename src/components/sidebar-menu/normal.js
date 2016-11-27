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
import React from 'react';
import { values } from 'lodash';

import { MENU_ITEMS } from '../../consts/sidebar-menu';

import Navigation from '../navigation';
import NavigationItem from '../navigation-item';

const menuItemsArray = values(MENU_ITEMS);

const SidebarMenuNormal = ({ current_user }) => {
  const user = current_user.get('user');
  let username = '';
  if (user) {
    username = user.get('username');
  }

  return (
    <Navigation>
      {menuItemsArray.map((item, i) => (
        <NavigationItem
          {...(item.html || {})}
          className={item.className}
          disabled={item.disabled}
          icon={item.icon}
          key={i}
          theme="2.0"
          to={item.url(username)}
        >
          {item.title.normal}
        </NavigationItem>
        ))
      }
    </Navigation>
  );
};

export default SidebarMenuNormal;