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
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ga from 'react-google-analytics';

import { defaultSelector } from '../selectors';
import { ActionsTrigger } from '../triggers';


const GAInitializer = ga.Initializer;

export class App extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  componentDidMount() {
    if (process.env.GOOGLE_ANALYTICS_ID) {
      ga('create', process.env.GOOGLE_ANALYTICS_ID, 'auto');
      ga('send', 'pageview');
    }
  }

  static async fetchData(params, store, client) {
    const props = store.getState();

    if (!props.get('current_user').get('id')) {
      return;
    }

    const triggers = new ActionsTrigger(client, store.dispatch);
    await triggers.loadUserTags();
  }

  render() {
    return (
      <div className="page">
        {this.props.children}

        <GAInitializer />
      </div>
    )
  }
}

export default connect(defaultSelector)(App);
