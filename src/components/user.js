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
import React, { Component } from 'react';
import Gravatar from 'react-gravatar';
import moment from 'moment';

import { URL_NAMES, getUrl } from '../utils/urlGenerator';

export default class User extends Component {
  render () {
    var { user, hideAvatar, hideText, avatarSize, timestamp, timestampLink } = this.props;
    var render = {};

    let user_url = getUrl(URL_NAMES.USER, { username: user.username })

    if (!hideAvatar) {
      render.avatar =
        <a href={user_url}>
          <Gravatar md5={user.gravatarHash} size={parseInt(avatarSize, 10)} default="retro" className="user_box__avatar" />
        </a>;
    }

    if (!hideText) {
      let name = user.username;

      if (user.more && user.more.firstName && user.more.lastName) {
        name = `${user.more.firstName} ${user.more.lastName}`;
      }

      name = name.trim();

      if (timestamp.length > 0 && timestampLink.length > 0) {
        let timestamp_string = moment(timestamp).format('MMMM D, HH:MM')
        render.timestamp =
          <p className="user_box__text">
            <a href={timestampLink}>
              {timestamp_string}
            </a>
          </p>
      }

      render.text =
        <div className="user_box__body">
          <p className="user_box__name"><a href={user_url}>{name}</a></p>
          {render.timestamp}
        </div>;
    }

    return (
        <div className="user_box">
          {render.avatar}
          {render.text}
        </div>
    )
  }

  static propTypes = {
    user: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      username: React.PropTypes.string.isRequired,
      avatar: React.PropTypes.string
    }).isRequired,
    gravatarHash: React.PropTypes.string,
    avatarSize: React.PropTypes.any.isRequired,
    hideAvatar: React.PropTypes.bool,
    hideText: React.PropTypes.bool,
    timestamp: React.PropTypes.string,
    timestampLink: React.PropTypes.string
  }

  static defaultProps = {
    hideAvatar: false,
    hideText: false,
    avatarSize: 24,
    timestamp: '',
    timestampLink: ''
  };
}
