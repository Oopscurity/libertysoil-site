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
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import NotFound from './not-found'
import BaseUserPage from './base/user'
import River from '../components/river_of_posts';

import ApiClient from '../api/client'
import {API_HOST} from '../config';
import {getStore, addUser, setUserPosts, addError} from '../store';

class UserPage extends React.Component {
  async componentWillMount() {
    let client = new ApiClient(API_HOST);

    let userInfo = client.userInfo(this.props.params.username);
    let userPosts = client.userPosts(this.props.params.username);

    try {
      getStore().dispatch(addUser(await userInfo));
      getStore().dispatch(setUserPosts(await userPosts));
    } catch (e) {
      console.log(e.stack)
    }
  }

  render() {
    let page_user = _.find(this.props.users, {username: this.props.params.username});

    if (_.isUndefined(page_user)) {
      return <script/>;  // not loaded yet
    }

    if (false === page_user) {
      return <NotFound/>
    }

    let user_posts = this.props.user_posts[page_user.id];

    let current_user, i_am_following;
    if (this.props.is_logged_in) {
      current_user = _.cloneDeep(this.props.users[this.props.current_user]);
      current_user.likes = this.props.likes[this.props.current_user];
      i_am_following = this.props.following[current_user.id];
    }

    return (
      <BaseUserPage current_user={current_user} i_am_following={i_am_following} is_logged_in={this.props.is_logged_in} page_user={page_user}>
        <River current_user={current_user} posts={this.props.posts} river={user_posts} users={this.props.users} />
      </BaseUserPage>
    )
  }
}

function select(state) {
  return state.toJS();
}

export default connect(select)(UserPage);
