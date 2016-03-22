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
import { Map, fromJS } from 'immutable';
import { keyBy } from 'lodash';

import * as a from '../actions';


const initialState = Map({});

const clearComments = (comments) => (
  comments.map(comment => {
    let _comment = {
      ...comment
    };
    delete _comment.user;

    return _comment;
  })
);

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case a.ADD_POST:
    case a.ADD_POST_TO_RIVER: {
      state = state.merge(fromJS(keyBy(clearComments(action.post.post_comments), 'id')));
      break;
    }

    case a.SET_POST_COMMENTS: {
      state = state.merge(fromJS(keyBy(clearComments(action.comments), 'id')));
      break;
    }
  }

  return state;
}
