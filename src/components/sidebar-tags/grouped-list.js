/*
 This file is a part of libertysoil.org website
 Copyright (C) 2017  Loki Education (Social Enterprise)

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
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { stringify } from 'query-string';

import ApiClient from '../../api/client';
import { API_HOST } from '../../config';
import createSelector from '../../selectors/createSelector';
import currentUserSelector from '../../selectors/currentUser';
import { ActionsTrigger } from '../../triggers';
import { rawToApi, rawToRiver } from '../../utils/river/query';

import { OldIcon as Icon } from '../icon';
import LoadableRiver from '../loadable-river';
import Modal from '../sidebar-modal';
// import Avatar from '../user/avatar';

import TagGroupRiver from './rivers/groups';

class SidebarGroupedTagList extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    const client = new ApiClient(API_HOST);
    this.triggers = new ActionsTrigger(client, props.dispatch);

    this.query = { ...props.location.query };
    this.apiQuery = rawToApi(this.query);
  }

  componentDidMount() {
    this.triggers.loadAllHashtags(this.apiQuery);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.location.query, this.query)) {
      this.query = { ...nextProps.location.query };
      this.apiQuery = rawToApi(this.query);
      this.triggers.loadAllHashtags(this.apiQuery);
    }
  }

  render() {
    return [
      <Modal.Navigation key="nav">
        {/*<Avatar
          isLink
          isRound={false}
          size={60}
          user={this.props.current_user.get('user')}
        />*/}
      </Modal.Navigation>,
      <Modal.Body key="body">
        <div className="sidebar-modal__header">
          <div className="sidebar-modal__title sidebar-modal__title--big">
            Hashtags
          </div>
          <Icon
            className="sidebar-modal__icon"
            color="white"
            outline="grey"
            icon="hashtag"
            size="common"
          />
        </div>
        <LoadableRiver
          component={TagGroupRiver}
          river={this.props.river}
          tags={this.props.hashtags}
        />
      </Modal.Body>
    ];
  }
}

const selectGroupedTagRiver = (state, props) => {
  const qs = stringify(rawToRiver(props.location.query));
  return state.getIn(['rivers', 'sidebar_tags', 'grouped', qs]);
};

const mapStateToProps = createSelector(
  currentUserSelector,
  selectGroupedTagRiver,
  state => state.get('hashtags'),
  (current_user, river, hashtags) => ({
    ...current_user,
    hashtags,
    river
  })
);

export default connect(mapStateToProps)(SidebarGroupedTagList);
