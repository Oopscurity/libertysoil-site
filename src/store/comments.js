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
import { Map, fromJS } from 'immutable';

import * as a from '../actions';

const initialState = Map({});

const clearComments = (comments) => (
  comments.map(comment => {
    const _comment = {
      ...comment
    };
    delete _comment.user;

    return _comment;
  })
);

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case a.river.ADD_POST_TO_RIVER:
    case a.posts.ADD_POST: {
      const comments = action.payload.post.post_comments || [];

      state = state.set(action.payload.post.id, fromJS(clearComments(comments)));

      break;
    }

    case a.river.SET_POSTS_TO_RIVER:
    case a.river.SET_POSTS_TO_LIKES_RIVER:
    case a.river.SET_POSTS_TO_FAVOURITES_RIVER:
    case a.posts.SET_USER_POSTS:
    case a.hashtags.SET_HASHTAG_POSTS:
    case a.schools.SET_SCHOOL_POSTS:
    case a.geotags.SET_GEOTAG_POSTS:
    case a.posts.SET_RELATED_POSTS: {
      action.payload.posts.forEach(post => {
        state = state.set(post.id, fromJS(clearComments(post.post_comments || [])));
      });

      break;
    }

    case a.comments.SET_POST_COMMENTS: {
      state = state.set(action.payload.postId, fromJS(clearComments(action.payload.comments)));

      break;
    }

    case a.posts.REMOVE_POST: {
      state = state.delete(action.payload.id);

      break;
    }
  }

  return state;
}
