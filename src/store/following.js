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
import i from 'immutable';

import * as a from '../actions';

const initialState = i.Map({});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case a.ADD_USER:
    case a.SET_CURRENT_USER: {
      if (action.user && action.user.following) {
        state = state.set(action.user.id, i.List(action.user.following.map(user => user.id)));
      }

      break;
    }
  }

  return state;
}
