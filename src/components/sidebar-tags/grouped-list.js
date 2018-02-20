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
import { Map } from 'immutable';
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

  handleRiverAutoLoad = async (isVisible) => {
    if (!isVisible) {
      return undefined;
    }

    let displayLoadMore = true;
    if (!this.props.inProgress) {
      const { entries } = await this.triggers.loadAllHashtags({
        ...this.apiQuery,
        offset: this.props.river.get('entries').size
      });
      displayLoadMore = entries.length >= this.apiQuery.limit;
    }

    return displayLoadMore;
  };

  render() {
    const { river } = this.props;

    return (
      <React.Fragment>
        <Modal.Navigation>
          {/*
            <Avatar
              isLink
              isRound={false}
              size={60}
              user={this.props.current_user.get('user')}
            />
          */}
        </Modal.Navigation>
        <Modal.Body>
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
          {/* get rid of conditional rendering with
              component-level fetchData() implementation */
            river.has('entries') && river.get('entries').size > 0 &&
            <LoadableRiver
              component={TagGroupRiver}
              offset={river.get('offset')}
              river={river.get('entries')}
              tags={this.props.hashtags}
              waiting={this.props.inProgress}
              onAutoLoad={this.handleRiverAutoLoad}
              onForceLoad={this.handleRiverAutoLoad}
            />
          }
        </Modal.Body>
      </React.Fragment>
    );
  }
}

const selectGroupedTagRiver = (state, props) => {
  const qs = stringify(rawToRiver(props.location.query));
  return state.getIn(['rivers', 'sidebar_tags', 'grouped', qs], Map());
};

const mapStateToProps = createSelector(
  currentUserSelector,
  selectGroupedTagRiver,
  state => state.get('hashtags'),
  state => state.get(['ui', 'progress', 'loadSidebarTagGroups']),
  (current_user, river, hashtags, inProgress) => ({
    ...current_user,
    hashtags,
    river,
    inProgress
  })
);

export default connect(mapStateToProps)(SidebarGroupedTagList);
