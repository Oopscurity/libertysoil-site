import React from 'react';
import request from 'superagent';
import { connect } from 'react-redux';

import store, {addError, setCurrentUser} from '../store';

export default class LoginComponent extends React.Component {
  async submitHandler(event) {
    event.preventDefault();

    let form = event.target;

    let login_data = {
      username: form.username.value,
      password: form.password.value
    };

    const host = 'http://localhost:8000';

    let result = await request.post(`${host}/api/v1/session`).type('form').send(login_data);

    if (result.body.success) {
      store.dispatch(setCurrentUser(result.body.user));
    } else {
      store.dispatch(addError('Invalid username or password'));
    }
  };

  render() {
    return (
      <div className="box box-middle">
        <header className="box__title">Login</header>
        <form onSubmit={this.submitHandler} action="" method="post">
          <div className="box__body">
            <div className="layout__row">
              <div className="form__row">
                <label className="label label-block">Username</label>
                <input className="input" type="text" name="username"/>
              </div>
              <div className="form__row">
                <label className="label label-block">Password</label>
                <input className="input" type="password" name="password"/>
              </div>
            </div>
            <div className="layout__row layout layout-align_vertical layout-align_justify">
              <a href="#" className="link">Password reminder</a>
              <button type="submit" className="button button-green">Login</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

