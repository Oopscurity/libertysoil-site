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
// @flow
import React from 'react';
import type { Element } from 'react';

/**
 * Split multiline text to <p> components.
 * @param {string} text - Text with multiline symbols.
 * @return {Array} Array of React <p> components.
 */
const paragraphify = (text: ?string): Array<Element<*>> | boolean => {
  if (!text || typeof text != 'string') {
    return false;
  }

  return text
    .split('\n')
    .map((line: string, i: number) => <p key={`text-${i}`}>{line}</p>);
};

export default paragraphify;
