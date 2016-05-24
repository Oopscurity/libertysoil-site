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
import React, { PropTypes } from 'react';
import TagCloud from '../tag-cloud';

const AddedTags = (props) => {
  const { geotags, hashtags, schools } = props;

  if (!geotags.length && !schools.length && !hashtags.length) {
    return <script />;
  }

  return (
    <div className="side_block">
      <h4 className="side_block__heading">Post tags:</h4>
      <TagCloud {...props} />
    </div>
  );
};

AddedTags.displayName = 'AddedTags';

AddedTags.propTypes = {
  geotags: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  })),
  hashtags: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  })),
  schools: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url_name: PropTypes.string.isRequired
  }))
};

export default AddedTags;
