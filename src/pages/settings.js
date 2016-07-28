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
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { ArrayOfMessages as ArrayOfMessagesPropType } from '../prop-types/messages';

import BaseSettingsPage from './base/settings';
import BasicInfoForm from '../components/settings/basic-info-form';

import ApiClient from '../api/client';
import { API_HOST } from '../config';
import { Command } from '../utils/command';
import { addUser } from '../actions/users';
import { addError } from '../actions/messages';
import { ActionsTrigger } from '../triggers';
import { defaultSelector } from '../selectors';

import { RolesManager } from '../components/settings';

class SettingsPage extends React.Component {
  static displayName = 'SettingsPage';

  static propTypes = {
    messages: ArrayOfMessagesPropType
  };

  static async fetchData(params, store, client) {
    const props = store.getState();

    const currentUserId = props.get('current_user').get('id');

    if (currentUserId === null) {
      return;
    }

    const currentUser = props.get('users').get(currentUserId);

    const userInfo = client.userInfo(currentUser.get('username'));
    store.dispatch(addUser(await userInfo));
  }

  handleChange = () => {
    if (this.base) {
      const command = new Command(
        'basic-info-form',
        this.handleSave
      );

      this.base.handleChange(command);
    }
  };

  handleSave = async () => {
    const client = new ApiClient(API_HOST);
    const triggers = new ActionsTrigger(client, this.props.dispatch);

    const roles = this.rolesManager._getRoles();
    // const processedPictures = {};
    // const pictures = this.base._getNewPictures();

    // for (const name in pictures) {
    //   processedPictures[name] = await triggers.uploadPicture({ ...pictures[name] });
    // }

    const formValues = this.form.formProps().values();

    let success;
    try {
      success = await triggers.updateUserInfo({
        more: {
          bio: formValues.bio,
          summary: formValues.summary,
          roles
          // ...processedPictures
        }
      });
    } catch (e) {
      success = false;
      this.props.dispatch(addError(e.message));
    }

    return { success };
  };

  render() {
    const {
      current_user,
      is_logged_in,
      messages,
      following,
      followers
    } = this.props;

    if (!is_logged_in) {
      return false;
    }

    let roles = [];
    if (current_user.id && current_user.user.more && current_user.user.more.roles) {
      roles = current_user.user.more.roles;
    }

    const client = new ApiClient(API_HOST);
    const triggers = new ActionsTrigger(client, this.props.dispatch);

    return (
      <BaseSettingsPage
        ref={c => this.base = c}
        current_user={current_user}
        followers={followers}
        following={following}
        is_logged_in={is_logged_in}
        messages={messages}
        triggers={triggers}
        onSave={this.handleSave}
      >
        <Helmet title="Your Profile Settings on " />
        <BasicInfoForm
          current_user={current_user}
          ref={c => this.form = c}
          onChange={this.handleChange}
        />
        <div className="paper__page">
          <h2 className="content__sub_title layout__row">Roles</h2>
          <RolesManager
            ref={c => this.rolesManager = c}
            roles={roles}
          />
        </div>
      </BaseSettingsPage>
    );
  }
}

export default connect(defaultSelector)(SettingsPage);
