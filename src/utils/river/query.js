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
import { difference, pick } from 'lodash';

import { sortByKeys } from '../lang';

const API_QUERY_PARAMETERS = [
  'group_by',
  'group_limit',
  'group_sort',
  'limit',
  'offset',
  'sort',
  'type'
];

const RIVER_QUERY_PARAMETERS = difference(
  API_QUERY_PARAMETERS,
  ['limit', 'offset']
);

export function rawToRiver(query) {
  return sortByKeys(pick(query, RIVER_QUERY_PARAMETERS));
}

export function groupedToFlat(query, group) {
  const result = {
    sort: query.group_sort,
    type: query.type
  };

  const { group_by } = query;
  if (group_by === 'first_letter' || group_by === 'starts_with') {
    result.starts_with = group.value;
  }

  return sortByKeys(result);
}

export function flatToGrouped() {
  // sort? 
}

export function rawToApi(query) {
  const result = pick(query, API_QUERY_PARAMETERS);

  if (result.offset) {
    result.offset = parseInt(result.offset);
  }
  if (result.limit) {
    result.limit = parseInt(result.limit);
  }

  return result;
}
