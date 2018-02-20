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
import { omit } from 'lodash';
import React from 'react';
import { parse } from 'query-string';

import Avatar from '../user/avatar';

const array = [];

function getWholeContext(acc, query) {
  if (!acc.length) {
    acc.push(query);
  }
  if (!query.ctx) {
    return acc;
  }
  return acc.push(parse(encodeURIComponent(query.ctx)));
}

export default function SidebarTagsNavigation(props) {
  

  return (
    <React.Fragment>
      {getWholeContext.map(ctx => {
        switch (ctx.view) {
          case 'grouped':
            return (
              <Icon />
            );
          case 'flat':
            return (
              <div>
                {}
              </div>
            );
          case 'single': {
            return (
              <Icon />
            );
          }
        }
      })}
      <Avatar
        isLink
        isRound={false}
        size={60}
        user={this.props.current_user.get('user')}
      />
    </React.Fragment>
  );
}
