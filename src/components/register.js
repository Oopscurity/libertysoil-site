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
import React, { Component, PropTypes } from 'react';
import { form as inform, from } from 'react-inform';
import ga from 'react-google-analytics';
import { assign, keys } from 'lodash';

import ApiClient from '../api/client';
import { API_HOST } from '../config';
import Message from './message';

class SuccessContent extends Component {
  clickHandler = (event) => {
    event.preventDefault();
    this.props.onShowRegisterForm();
  };

  render() {
    return (
      <div className="box box-middle">
        <header className="box__title">Registration success</header>
        <div className="box__body">
          <div className="layout__row">
            <div>Please check your email for further instructions. Or <a className="link" href="#" onClick={this.clickHandler}>display register form.</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class Register extends React.Component {
  static displayName = 'Register';

  static propTypes = {
    fields: PropTypes.shape({
      username: PropTypes.shape({
        error: PropTypes.string
      }).isRequired,
      password: PropTypes.shape({
        error: PropTypes.string
      }).isRequired,
      passwordRepeat: PropTypes.shape({
        error: PropTypes.string
      }).isRequired,
      email: PropTypes.shape({
        error: PropTypes.string
      }).isRequired,
      agree: PropTypes.shape({
        error: PropTypes.string
      }).isRequired
    }).isRequired,
    form: PropTypes.shape({
      forceValidate: PropTypes.func.isRequired,
      isValid: PropTypes.func.isRequired,
      onValues: PropTypes.func.isRequired
    }).isRequired,
    onRegisterUser: PropTypes.func.isRequired,
    onShowRegisterForm: PropTypes.func.isRequired,
    registration_success: PropTypes.bool
  };

  constructor() {
    super();

    this.usernameFocused = false;
    this.usernameManuallyChanged = false;

    this.state = {
      firstName: '',
      lastName: ''
    };
  }

  componentDidMount() {
    this.username.addEventListener('focus', this.usernameFocusHandler);
    this.username.addEventListener('blur', this.usernameBlurHandler);
    this.username.addEventListener('input', this.inputUsername);
  }

  componentWillUnmount() {
    this.username.removeEventListener('focus', this.usernameFocusHandler);
    this.username.removeEventListener('blur', this.usernameBlurHandler);
    this.username.removeEventListener('input', this.inputUsername);
  }

  submitHandler = (event) => {
    event.preventDefault();
    const { form, fields } = this.props;

    form.forceValidate();
    if (!form.isValid()) {
      return;
    }

    this.props.onRegisterUser(
      fields.username.value,
      fields.password.value,
      fields.email.value,
      this.firstName.value,
      this.lastName.value
    );
  };

  getAvailableUsername = async (username) => {
    const client = new ApiClient(API_HOST);
    return await client.getAvailableUsername(username);
  };

  changeName = async (event) => {
    const field = event.target;
    const attr = field.getAttribute('name');
    if (!keys(this.state).find(v => v === attr)) {
      return;
    }

    const input = field.value.replace(/[\f\n\r\t\v0-9]/g, '');
    this.setState({ [attr]: input });

    if (this.usernameManuallyChanged) {
      return;
    }

    let result = input + this.state.lastName;
    if (attr === 'lastName') {
      result = this.state.firstName + input;
    }

    result = result.trim();
    if (result) {
      result = await this.getAvailableUsername(result);
    }
    this.changeUsername(result);
  };

  inputUsername = (event) => {
    if (this.usernameFocused) {
      this.usernameManuallyChanged = true;
    }

    const field = event.target;
    const raw = field.value;
    this.changeUsername(raw);
  };

  changeUsername = (input) => {
    const filtered = input.replace(/[^-_\.'A-Za-z0-9]/g, '').substr(0, 30);

    const { form } = this.props;
    const nextValues = assign({}, form.values(), {
      username: filtered
    });
    form.onValues(nextValues);
  }

  usernameFocusHandler = () => {
    this.usernameFocused = true;
  };

  usernameBlurHandler = () => {
    this.usernameFocused = false;
  };

  render() {
    const { fields, form } = this.props;

    if (this.props.registration_success) {
      ga('send', 'event', 'Reg', 'Done');
      return <SuccessContent onShowRegisterForm={this.props.onShowRegisterForm} />;
    }

    const reset = ((e) => e.target.setCustomValidity(''));
    return (
      <div className="div" id="register">
        <header className="layout__row layout__row-double">
          <p className="layout__row content content-small">Create new account</p>
          <div className="layout__row content__head">Be the change</div>
          <div className="layout__row content content-small">
            <p>Connect with parents and education professionals from around the world to make education better for all children in all schools and families worldwide.</p>
          </div>
        </header>
        <form action="" className="layout__row" id="registerForm" onSubmit={this.submitHandler}>
          <div className="layout__row">
            <div className="layout__row layout__row-double">
              <label className="label label-before_input" htmlFor="registerFirstName">First name</label>
              <input className="input input-gray input-big input-block" id="registerFirstName" name="firstName" placeholder="Firstname" type="text" onBlur={reset} onChange={this.changeName} ref={(c) => this.firstName = c} value={this.state.firstName} />
            </div>
            <div className="layout__row layout__row-double">
              <label className="label label-before_input" htmlFor="registerLastName">Last name</label>
              <input className="input input-gray input-big input-block" id="registerLastName" name="lastName" placeholder="Lastname" type="text" onBlur={reset} onChange={this.changeName} ref={(c) => this.lastName = c} value={this.state.lastName} />
            </div>
            <div className="layout__row layout__row-double">
              <label className="label label-before_input" htmlFor="username">Username</label>
              <input className="input input-gray input-big input-block" id="username" name="username" placeholder="Username" ref={(c) => this.username = c} required="required" type="text" {...fields.username} />
              {fields.username.error &&
                <Message message={fields.username.error} />
              }
            </div>
            <div className="layout__row layout__row-double">
              <label className="label label-before_input" htmlFor="registerPassword">Password</label>
              <input className="input input-gray input-big input-block" id="registerPassword" name="password" ref={(c) => this.password = c} required="required" type="password" {...fields.password} />
              {fields.password.error &&
                <Message message={fields.password.error} />
              }
            </div>
            <div className="layout__row layout__row-double">
              <label className="label label-before_input" htmlFor="registerPasswordRepeat">Repeat password</label>
              <input className="input input-gray input-big input-block" id="registerPasswordRepeat" name="password_repeat" ref={(c) => this.passwordRepeat = c} required="required" type="password" {...fields.passwordRepeat} />
              {fields.passwordRepeat.error &&
                <Message message={fields.passwordRepeat.error} />
              }
            </div>
            <div className="layout__row layout__row-double">
              <label className="label label-before_input label-space" htmlFor="registerEmail">Email</label>
              <input className="input input-gray input-big input-block" id="registerEmail" name="email" placeholder="email.address@example.com" ref={(c) => this.email = c} required="required" type="email" {...fields.email} />
              {fields.email.error &&
                <Message message={fields.email.error} />
              }
            </div>
          </div>
          <div className="layout__row layout__row-double">
            {fields.agree.error &&
              <Message message={fields.agree.error} />
            }
            <div className="layout__grid layout__grid-big layout-align_vertical">
              <button className="button button-big button-green">Sign up</button>
              <label className="action checkbox">
                <input id="registerAgree" name="agree" required="required" type="checkbox" {...fields.agree} />
                <span className="checkbox__label-right">I agree to Terms &amp; Conditions</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const checkEmailNotTaken = (email) => {
  const client = new ApiClient(API_HOST);
  return client.checkEmailTaken(email).then(taken => !taken);
};

const checkUsernameNotTaken = (username) => {
  const client = new ApiClient(API_HOST);
  return client.checkUserExists(username).then(exists => !exists);
};

const validatePassword = (password) => {
  if (password && password.length < 8) {
    return false;
  }
  return true;
};

const validatePasswordRepeat = (passwordRepeat, form) => {
  if (form.password !== passwordRepeat) {
    return false;
  }
  return true;
};

const WrappedRegister = inform(from({
  username: {
    'You must enter username to continue': u => u,
    'Username is taken': checkUsernameNotTaken
  },
  email: {
    'You must enter email to continue': e => e,
    'Email is taken': checkEmailNotTaken
  },
  password: {
    'You must enter password to continue': p => p,
    'Password must contain at least 8 symbols': validatePassword
  },
  passwordRepeat: {
    'You must enter your password again to continue': p => p,
    'Passwords don\'t match': validatePasswordRepeat
  },
  agree: {
    'You have to agree to Terms before registering': a => a
  }
}))(Register);

export default WrappedRegister;
