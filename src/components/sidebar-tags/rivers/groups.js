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
import { List } from 'immutable';
import memoize from 'memoizee';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { stringify } from 'query-string';

function getTagIdKey(type) {
  switch (type) {
    case 'geotags':
      return 'url_name';
    case 'hashtags':
      return 'name';
    case 'schools':
      return 'id';
    default:
      return undefined;
  }
}

const getTagViewLocationPush = memoize((idKey, idValue) => (
  (location) => ({
    ...location,
    query: {
      ctx: encodeURIComponent(location.search),
      route: 'tags',
      type: 'hashtag',
      view: 'single',
      [idKey]: idValue
    }
  })
), { primitive: true });

const getFlatRiverLocationPush = memoize((group) => (
  (location) => ({
    ...location,
    query: {
      ctx: encodeURIComponent(location.search),
      offset: 0,
      route: 'tags',
      sort: group.group_sort,
      type: group.type,
      view: 'flat',
      [group.key]: group.value
    }
  })
), { primitive: true });

export default class TagGroupRiver extends React.PureComponent {
  static propTypes = {
    component: PropTypes.func
  };

  static defaultProps = {
    river: List()
  };

  render() {
    const { river } = this.props;

    if (!river || !river.get('entries')) {
      return false;
    }

    const { tags } = this.props;
    const idKey = getTagIdKey(this.props.type);

    return (
      <div>
        {this.props.river.get('entries').map(group => (
          <div
            className="sidebar-section"
            key={group.get('value')}
          >
            <div className="sidebar-section__title">
              #{group.get('value').toUpperCase()}
            </div>
            <div className="sidebar-section__content sidebar-list">
              {group.get('entries').take(10).map(id => {
                const tag = tags.get(id);
                return (
                  <Link
                    className="sidebar-list-item sidebar-list-item__container sidebar-list-item__paper-container"
                    key={id}
                    to={getTagViewLocationPush(idKey, id)}
                  >
                    <div className="sidebar-list-item__content sidebar-list-item__paper">
                      {tag.get('name')}
                    </div>
                    <div className="sidebar-list-item__counter sidebar-list-item__paper">
                      {tag.get('post_count')}
                    </div>
                  </Link>
                );
              })}
              <div className="sidebar-list__more">
                <div className="sidebar-list__counter">{group.get('count')}</div>
                <div className="sidebar-list__more-link">
                  {group.get('count') > 10 &&
                    <Link
                      className=""
                      to={getFlatRiverLocationPush(group)}
                    >
                      more
                    </Link>
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
