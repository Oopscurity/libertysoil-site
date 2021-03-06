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
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import isEqual from 'lodash/isEqual';
import intersection from 'lodash/intersection';
import clone from 'lodash/clone';

import ApiClient from '../api/client';
import { API_HOST } from '../config';
import { CurrentUser as CurrentUserPropType } from '../prop-types/users';
import { SEARCH_SORTING_TYPES } from '../consts/search';
import { offsetTop } from '../utils/browser';
import { searchObject } from '../store/search';

import {
  Page,
  PageMain,
  PageBody,
  PageContent
} from '../components/page';
import Header from '../components/header';
import HeaderLogo from '../components/header-logo';
import Breadcrumbs from '../components/breadcrumbs/breadcrumbs';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import SidebarAlt from '../components/sidebarAlt';
import { ActionsTrigger } from '../triggers';
import { createSelector, currentUserSelector } from '../selectors';
import SearchSection from '../components/search/section';
import SearchResultFilter from '../components/filters/search-result-filter';
import SearchPageBar from '../components/search/page-bar';
import SortingFilter from '../components/filters/sorting-filter';

function filterSections(query = {}) {
  const visible = ['locations', 'hashtags', 'schools', 'posts', 'people'];
  if (!query.show || query.show === 'all') {
    return visible;
  }

  let queried = clone(query.show);
  if (!Array.isArray(queried)) {
    queried = [queried];
  }

  return intersection(visible, queried);
}

const client = new ApiClient(API_HOST);

class SearchPage extends Component {
  static displayName = 'SearchPage';

  static propTypes = {
    current_user: CurrentUserPropType,
    is_logged_in: PropTypes.bool.isRequired
  };

  static async fetchData(router, store, client) {
    const triggers = new ActionsTrigger(client, store.dispatch);

    const query = router.location.query;
    if (router.type) {
      query.show = router.type;
    }
    await triggers.search(query, { searchId: 'page' });
  }

  constructor(props, ...args) {
    super(props, ...args);
    this.triggers = new ActionsTrigger(client, props.dispatch);
  }

  componentWillReceiveProps(nextProps) {
    const nextQuery = clone(nextProps.location.query);
    if (nextProps.params.type) {
      nextQuery.show = nextProps.params.type;
    }

    if (!isEqual(this.props.location.query, nextQuery)) {
      this.triggers.search(nextQuery, { searchId: 'page' });
    }
  }

  handleSectionPageOpen = () => {
    if (window && document) {
      const top = offsetTop(findDOMNode(this.searchResults)) - 50;
      const windowTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (windowTop > top) {
        window.scrollTo(0, top);
      }
    }
  };

  render() {
    const {
      is_logged_in,
      current_user,
      location,
      params,
      search
    } = this.props;

    let visibleSections;
    if (params.type) {
      visibleSections = filterSections({ show: params.type });
    } else {
      visibleSections = filterSections(location.query);
    }

    let offset;
    if (location.query.offset) {
      offset = parseInt(location.query.offset);
    }

    return (
      <div>
        <Helmet title="Search of " />
        <Header current_user={current_user} is_logged_in={is_logged_in}>
          <HeaderLogo />
          <div className="header__breadcrumbs">
            <Breadcrumbs title="Search" />
          </div>
        </Header>

        <Page>
          <PageMain>
            <PageBody className="search__page">
              <Sidebar />
              <div className="search__content">
                <SearchPageBar location={location} />
                <SidebarAlt side="left">
                  <SortingFilter
                    location={location}
                    sortingTypes={SEARCH_SORTING_TYPES}
                  />
                  <SearchResultFilter
                    fixedType={params.type}
                    location={location}
                  />
                </SidebarAlt>
                <PageContent ref={c => this.searchResults = c}>
                  {search.get('results')
                    .filter((_, key) =>
                      !!visibleSections.find(t => key === t)
                    )
                    .map((payload, type) =>
                      ImmutableMap({ type, payload })
                    )
                    .toList()
                    .map(section => (
                      <SearchSection
                        count={section.getIn(['payload', 'count'])}
                        current_user={current_user}
                        items={section.getIn(['payload', 'items'])}
                        key={section.get('type')}
                        needPaging={!!params.type}
                        offset={offset}
                        triggers={this.triggers}
                        type={section.get('type')}
                        onSectionPageOpen={this.handleSectionPageOpen}
                      />
                    ))
                  }
                </PageContent>
              </div>
            </PageBody>
          </PageMain>
        </Page>

        <Footer />
      </div>
    );
  }
}

const selector = createSelector(
  [currentUserSelector, state => state.getIn(['search', 'page'], searchObject)],
  (current_user, search) => ({
    ...current_user,
    search
  })
);

export default connect(selector)(SearchPage);
