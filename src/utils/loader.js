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
import { isPlainObject, isNumber } from 'lodash';
import { browserHistory } from 'react-router';

/**
 * Combines onEnter handlers into one function.
 * The function calls handlers in specified order and returns early
 * if one of the handlers returns true.
 * @param handlers
 * @returns {Function}
 */
export function combineHandlers(...handlers) {
  return async (nextState, replace) => {
    for (let handler of handlers) {
      if (handler) {
        let shouldInterrupt = await handler(nextState, replace);
        if (shouldInterrupt === true) {
          break;
        }
      }
    }
  }
}

export function combineHandlersAsync(...handlers) {
  return async (nextState, replace, callback) => {
    let callbacksTodo = 0;

    let callbackDecreaser = () => {
      callbacksTodo -= 1;

      if (callbacksTodo === 0) {
        callback();
        return;
      }

      if (callbacksTodo < 0) {
        throw new Error('too many callbacks called');
      }
    };

    for (let handler of handlers) {
      if (handler) {
        if (handler.length >= 3) {
          callbacksTodo += 1;

          let shouldInterrupt = await handler(nextState, replace, callbackDecreaser);
          if (shouldInterrupt === true) {
            break;
          }
        } else {
          let shouldInterrupt = await handler(nextState, replace);
          if (shouldInterrupt === true) {
            break;
          }
        }
      }
    }

    if (callbacksTodo === 0) {
      callback();
    }
  }
}

export class AuthHandler {
  constructor(store) {
    this.store = store;
  }

  handle = async (nextState, replace) => {
    let state = this.store.getState();

    if (state.getIn(['current_user', 'id']) === null
      && nextState.location.pathname !== '/welcome'
    ) {
      replace('/welcome');
      return true;  // interrupt
    }

    return false;
  };
}

export class FetchHandler {
  status = null;
  redirectTo = null;

  constructor(store, apiClient) {
    this.store = store;
    this.apiClient = apiClient;
  }

  handle = async (nextState) => {
    let len = nextState.routes.length;

    for (let i = len; i--; i >= 0) {
      let route = nextState.routes[i];

      if ('component' in route && 'fetchData' in route.component) {
        try {
          const response = await route.component.fetchData(nextState.params, this.store, this.apiClient);

          if (isPlainObject(response)) {
            const {status, redirectTo} = response;
            this.status = status;
            this.redirectTo = redirectTo;

            browserHistory.push(redirectTo);
          } else if (isNumber(response)) {
            this.status = response;
          }
        } catch (e) {
          // FIXME: handle error in a useful fashion (show "Network error" to user, ask to reload page, etc.)
          console.error(e);  // eslint-disable-line no-console
        }
      }
    }
  };

  handleSynchronously = (nextState, replace, callback) => {
    this.handle(nextState)
      .then(() => { callback(); })
      .catch((e) => {
        // FIXME: this should be reported to developers instead (use Sentry?)
        console.error(e);  // eslint-disable-line no-console
        callback(e);
      });
  };
}

