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
import i from 'immutable';

import { userMessages } from '../actions';


// user_id => list of messages
export const initialState = i.Map();

export function reducer(state = initialState, action) {
  switch (action.type) {
    case userMessages.SET_USER_MESSAGES: {
      state = state.set(action.payload.userId, i.fromJS(action.payload.messages));

      break;
    }

    case userMessages.ADD_USER_MESSAGE: {
      state = state.update(action.payload.userId, messages => (messages || i.List()).push(i.fromJS(action.payload.message)));

      break;
    }
  }

  return state;
}
