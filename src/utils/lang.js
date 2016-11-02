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
import reduce from 'lodash/reduce';
import isPlainObject from 'lodash/isPlainObject';

export function toSpreadArray(obj) {
  return reduce(obj, (arr, value, key) => {
    arr.push({ [key]: value });
    return arr;
  }, []);
}

export function castObject(value, fieldName) {
  if (isPlainObject(value)) {
    return value;
  }

  return { [fieldName]: value };
}
