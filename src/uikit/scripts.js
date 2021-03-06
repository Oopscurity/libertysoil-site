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
import bluebird from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import { AuthHandler, FetchHandler } from '../utils/loader';
import { API_HOST } from '../config';
import ApiClient from '../api/client';

import { configureStore } from './reducers';
import { getRoutes } from './routes';


window.Promise = bluebird;

const store = configureStore(window.state);
const browserHistory = useRouterHistory(createHistory)({
  basename: '/uikit/'
});

const history = syncHistoryWithStore(browserHistory, store, { selectLocationState: state => state.get('routing') });

const client = new ApiClient(API_HOST);

const authHandler = new AuthHandler(store);
const fetchHandler = new FetchHandler(store, client);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes(authHandler.handle, fetchHandler.handle, fetchHandler.handleChange)}
    </Router>
  </Provider>,
  document.getElementById('content')
);
