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
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Map as ImmutableMap } from 'immutable';

import { Tab, Tabs, TagCloud } from '../../deps';

import HashtagSelect from './select';

const TAB_TITLES = ['Enter manually', 'Used recently', 'Popular'];

export default class AddHashtagForm extends Component {
  static displayName = 'AddHashtagForm';

  static propTypes = {
    addedHashtags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string
    })).isRequired,
    onAddHashtag: PropTypes.func.isRequired,
    userRecentHashtags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string
    })).isRequired
  };

  _handleEnter = (event) => {
    event.preventDefault();

    const tagName = this._input.value.trim();

    this._addTag({ name: tagName });
  };

  _selectRecentlyUsedHashtag = (tag) => {
    const index = this.props.userRecentHashtags.findIndex(t => t.get('name') === tag.name);
    this._addTag(this.props.userRecentHashtags.get(index).toJS());
  };

  _addTag = (tag) => {
    if (tag.name.length < 3) {
      return;
    }

    if (this.props.addedHashtags.find(t => t.get('name') === tag.name)) {
      return;
    }

    this._input.reset();
    this.props.onAddHashtag(tag);
  };

  render() {
    const popularHashtags = [];
    const tabClassName = 'add_tag_modal__tab_panel add_tag_modal__tab_panel-top_colored';

    return (
      <div className="add_tag_modal add_tag_modal-hashtag">
        <Tabs>
          <div className="tabs-font_inherit">
            <div className="add_tag_modal__tabs">
              {TAB_TITLES.map((title, i) => (
                <Tab.Title activeClassName="add_tag_modal__tab-active" className="add_tag_modal__tab" index={i} key={i}>
                  {title}
                </Tab.Title>
              ))}
            </div>

            <Tab.Content className={`${tabClassName} add_tag_modal__tab_panel-colored`} index={0}>
              <form onSubmit={this._handleEnter}>
                <div className="layout">
                  <div className="layout__grid_item layout__grid_item-wide">
                    <HashtagSelect
                      placeholder="Start typing..."
                      ref={(c) => this._input = c}
                      onSelect={this._addTag}
                    />
                  </div>
                  <div className="layout__grid_item">
                    <button className="button button-wide add_tag_modal__add_button action">
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </Tab.Content>

            <Tab.Content className={tabClassName} index={1}>
              Used recently:
              <TagCloud
                action="add"
                className="add_tag_modal__tags-panel"
                tags={ImmutableMap({ hashtags: this.props.userRecentHashtags })}
                onClick={this._selectRecentlyUsedHashtag}
              />
            </Tab.Content>

            <Tab.Content className={tabClassName} index={2}>
              Popular:
              <TagCloud
                action="add"
                className="add_tag_modal__tags-panel"
                tags={ImmutableMap({ hashtags: popularHashtags })}
              />
            </Tab.Content>
          </div>
        </Tabs>
      </div>
    );
  }
}
