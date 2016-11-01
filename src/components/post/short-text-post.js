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
import React from 'react';
import Linkify from 'react-linkify';

const ShortTextPost = ({ post }) => {
  let text = '';

  if (post.get('text')) {
    text = post.get('text').split('\n').map((line, i) => <p key={`text-${i}`}>{line}</p>);
  }

  return (
    <Linkify properties={{ target: '_blank' }}>
      {text}
    </Linkify>
  );
};

export default ShortTextPost;
