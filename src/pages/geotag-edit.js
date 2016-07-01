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
import { bindActionCreators } from 'redux';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import { values } from 'lodash';

import { defaultSelector } from '../selectors';

import { API_HOST } from '../config';
import ApiClient from '../api/client';
import BaseTagPage from './base/tag';
import { resetCreatePostForm, updateCreatePostForm } from '../actions/posts';
import { addGeotag } from '../actions/geotags';
import { ActionsTrigger } from '../triggers';
import { URL_NAMES, getUrl } from '../utils/urlGenerator';
import TagEditForm from '../components/tag-edit-form/tag-edit-form';
import NotFound from './not-found';
import { TAG_LOCATION } from '../consts/tags';

class GeotagEditPage extends React.Component {
  static displayName = 'GeotagEditPage';

  static async fetchData(params, store, client) {
    const geotag = client.getGeotag(params.url_name);

    try {
      store.dispatch(addGeotag(await geotag));
    } catch (e) {
      store.dispatch(addGeotag({ url_name: params.url_name }));

      return 404;
    }

    const trigger = new ActionsTrigger(client, store.dispatch);
    await trigger.loadSchools();

    return 200;
  }

  constructor(props) {
    super(props);

    this.state = {
      processing: false
    };
  }

  saveGeotag = async (id, description) => {
    this.setState({ processing: true });

    const client = new ApiClient(API_HOST);
    const triggers = new ActionsTrigger(client, this.props.dispatch);

    const more = { description };

    try {
      const result = await triggers.updateGeotag(id, { more });
      browserHistory.push(getUrl(URL_NAMES.GEOTAG, { url_name: result.url_name }));
    } catch (e) {
      if (confirm("Saving changes failed. Would you like to try again?")) {
        this.saveGeotag(id, description);
        return;
      }
    }

    this.setState({ processing: false });
  };

  render() {
    const {
      is_logged_in,
      current_user,
      resetCreatePostForm,
      updateCreatePostForm,
      params,
      geotags,
      schools,
      messages
    } = this.props;

    const client = new ApiClient(API_HOST);
    const triggers = new ActionsTrigger(client, this.props.dispatch);
    const actions = { resetCreatePostForm, updateCreatePostForm };

    const geotag = geotags[this.props.params.url_name];
    const title = geotag ? geotag.name : this.props.params.url_name;

    if (!geotag) {
      return null;
    }

    if (!geotag.id) {
      return <NotFound />;
    }

    return (
      <BaseTagPage
        editable
        params={params}
        current_user={current_user}
        tag={geotag}
        type={TAG_LOCATION}
        is_logged_in={is_logged_in}
        actions={actions}
        triggers={triggers}
        schools={values(schools)}
        create_post_form={this.props.create_post_form}
      >
        <Helmet title={`${title} posts on `} />
        <div className="paper">
          <div className="paper__page">
            <TagEditForm
              tag={geotag}
              type={TAG_LOCATION}
              messages={messages}
              triggers={triggers}
              saveHandler={this.saveGeotag}
              processing={this.state.processing}
            />
          </div>
        </div>
      </BaseTagPage>
    );
  }
}

export default connect(defaultSelector, dispatch => ({
  dispatch,
  ...bindActionCreators({ resetCreatePostForm, updateCreatePostForm }, dispatch)
}))(GeotagEditPage);
