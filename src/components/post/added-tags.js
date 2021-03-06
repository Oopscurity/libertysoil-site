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

import React from 'react';
import { List, Map as ImmutableMap } from 'immutable';

import { ArrayOfGeotags as ArrayOfGeotagsPropType } from '../../prop-types/geotags';
import { ArrayOfHashtags as ArrayOfHashtagsPropType } from '../../prop-types/hashtags';
import {
  ArrayOfSchools as ArrayOfSchoolsPropType,
  ArrayOfLightSchools as ArrayOfLightSchoolsPropType
} from '../../prop-types/schools';

import TagCloud from '../tag-cloud';

const AddedTags = ({ geotags, hashtags, schools, ...props }) => {
  if (!geotags.size && !schools.size && !hashtags.size) {
    return null;
  }

  return (
    <div className="side_block">
      <h4 className="side_block__heading">Post tags:</h4>
      <TagCloud
        {...props}
        tags={ImmutableMap({ geotags, hashtags, schools })}
      />
    </div>
  );
};

AddedTags.displayName = 'AddedTags';

AddedTags.propTypes = {
  geotags: ArrayOfGeotagsPropType,
  hashtags: ArrayOfHashtagsPropType,
  schools: PropTypes.oneOfType([
    ArrayOfLightSchoolsPropType,
    ArrayOfSchoolsPropType
  ])
};

AddedTags.defaultProps = {
  geotags: List(),
  hashtags: List(),
  schools: List()
};

export default AddedTags;
