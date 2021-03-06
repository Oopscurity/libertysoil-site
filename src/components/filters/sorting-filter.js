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

 @flow
*/
import React from 'react';

import type { RouterLocation } from '../../definitions/common';
import type { SortingType } from '../../definitions/filters';
import FilterLink from './filter-link';


type Props = {
  location: RouterLocation,
  sortingTypes: SortingType[],
};

export default function SortingFilter({ location, sortingTypes }: Props) {
  const continents = sortingTypes.map((item, i) => (
    <FilterLink
      isDefault={item.isDefault}
      key={i}
      location={location}
      query={{ sort: item.value }}
      title={item.name}
    />
  ));

  return (
    <div className="aux-nav">
      {continents}
    </div>
  );
}
