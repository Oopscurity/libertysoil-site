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
import _ from 'lodash';

import * as a from '../actions';

const initialState = i.Map({});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case a.posts.ADD_POST:
    case a.posts.CREATE_POST: {
      const postCopy = _.cloneDeep(action.payload.post);

      delete postCopy.user;
      delete postCopy.post_comments;

      state = state.set(postCopy.id, i.fromJS(postCopy));

      break;
    }

    case a.bestPosts.ADD_POSTS_TO_BEST_POSTS:
    case a.bestPosts.SET_BEST_POSTS:
    case a.mostFavouritedPosts.ADD_POSTS_TO_MOST_FAVOURITED_POSTS:
    case a.mostFavouritedPosts.SET_MOST_FAVOURITED_POSTS:
    case a.mostLikedPosts.ADD_POSTS_TO_MOST_LIKED_POSTS:
    case a.mostLikedPosts.SET_MOST_LIKED_POSTS:
    case a.allPosts.ADD_POSTS_TO_ALL_POSTS:
    case a.allPosts.SET_ALL_POSTS:
    case a.river.SET_POSTS_TO_RIVER:
    case a.river.SET_POSTS_TO_LIKES_RIVER:
    case a.river.SET_POSTS_TO_FAVOURITES_RIVER:
    case a.river.LOAD_HASHTAG_SUBSCRIPTONS_RIVER:
    case a.river.LOAD_SCHOOL_SUBSCRIPTONS_RIVER:
    case a.river.LOAD_GEOTAG_SUBSCRIPTONS_RIVER:
    case a.posts.SET_USER_POSTS:
    case a.hashtags.SET_HASHTAG_POSTS:
    case a.schools.SET_SCHOOL_POSTS:
    case a.geotags.SET_GEOTAG_POSTS:
    case a.posts.SET_RELATED_POSTS:
    case a.tools.TOOLS__ADD_USER_POSTS_TO_RIVER:
    case a.tools.TOOLS__SET_USER_POSTS_RIVER: {
      const postsWithoutUsers = _.keyBy(action.payload.posts.map(post => {
        const postCopy = _.cloneDeep(post);

        delete postCopy.user;
        delete postCopy.post_comments;

        return postCopy;
      }), 'id');

      state = state.merge(i.fromJS(postsWithoutUsers));

      break;
    }

    case a.posts.REMOVE_PROFILE_POST:
    case a.posts.REMOVE_POST: {
      state = state.remove(action.payload.id);
      break;
    }

    case a.users.SET_LIKES: {
      // FIXME: move to separate reducer?
      if (action.payload.post_id) {
        state = state.setIn([action.payload.post_id, 'likers'], action.payload.likers);
      }
      break;
    }

    case a.users.SET_FAVOURITES: {
      // FIXME: move to separate reducer?
      if (action.payload.post_id) {
        state = state.setIn([action.payload.post_id, 'favourers'], action.payload.favourers);
      }
      break;
    }

    case a.posts.SET_PROFILE_POSTS: {
      const posts = _.keyBy(action.payload.posts, 'id');
      state = state.merge(i.fromJS(posts));
      break;
    }
    case a.posts.UPDATE_PROFILE_POST:
    case a.posts.ADD_PROFILE_POST: {
      const post = action.payload.post;
      state = state.set(post.id, i.fromJS(post));
      break;
    }
  }

  return state;
}
