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
export const ADD_POSTS_TO_BEST_POSTS = 'ADD_POSTS_TO_BEST_POSTS';
export const SET_BEST_POSTS = 'SET_BEST_POSTS';

export function addPosts(posts) {
  return {
    type: ADD_POSTS_TO_BEST_POSTS,
    payload: {
      posts
    }
  };
}

export function setPosts(posts) {
  return {
    type: SET_BEST_POSTS,
    payload: {
      posts
    }
  };
}
