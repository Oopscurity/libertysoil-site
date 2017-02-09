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
export const ADD_ERROR = 'ADD_ERROR';
export const ADD_MESSAGE = 'ADD_MESSAGE';

export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const REMOVE_ALL_MESSAGES = 'REMOVE_ALL_MESSAGES';

export function addError(message) {
  return {
    type: ADD_ERROR,
    payload: {
      message
    }
  };
}

export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    payload: {
      message
    }
  };
}

export function removeMessage(index) {
  return {
    type: REMOVE_MESSAGE,
    payload: {
      index
    }
  };
}

export function removeAllMessages() {
  return {
    type: REMOVE_ALL_MESSAGES
  };
}
