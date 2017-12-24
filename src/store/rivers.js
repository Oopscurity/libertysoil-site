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
import i from 'immutable';
import { stringify } from 'query-string';

import { river } from '../actions';
import extendRiver from '../utils/river/extend';
import { groupedToFlat, rawToRiver } from '../utils/river/query';

export const initialState = i.Map({
  sidebar_tags: i.Map({
    grouped: i.Map(),
    flat: i.Map()
  })
});

export function reducer(state = initialState, action) {
  switch (action.type) {
    case river.LOAD_GROUPED_TAG_RIVER: {
      const { query } = action.meta;
      const qs = stringify(rawToRiver(query));

      const groups = {
        entries: action.payload.groups.map(group => ({
          ...group,
          entries: group.entries.map(tag => tag.url_name || tag.name)
        })),
        offset: query.offset
      };

      state = state.withMutations(s => {
        s.updateIn(
          ['sidebar_tags', 'grouped', qs],
          river => extendRiver(river, groups)
        );

        for (let group, l = groups.entries.length, i = 0; i < l; ++i) {
          group = groups.entries[i];
          s.updateIn(
            [
              'sidebar_tags',
              'flat',
              stringify(groupedToFlat(query, group))
            ],
            river => extendRiver(river, group)
          );
        }
      });

      break;
    }
    case river.LOAD_FLAT_TAG_RIVER: {
      const { query } = action.meta;
      const qs = stringify(rawToRiver(query));

      const nextRiver = {
        entries: action.payload.tags.map(tag => tag.url_name || tag.name),
        offset: query.offset
      };

      state = state.updateIn(
        ['sidebar_tags', 'flat', qs],
        river => extendRiver(river, nextRiver)
      );

      break;
    }
  }

  return state;
}
