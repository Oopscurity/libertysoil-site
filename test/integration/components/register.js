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
/* eslint-env node, mocha */
/* global $dbConfig,setTimeout */
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import sinon from 'sinon';

import RegisterFormV1, { UnwrappedRegisterFormV1 } from '../../../src/components/register/v1/form';
import { initState } from '../../../src/store';
import initBookshelf from '../../../src/api/db';
import expect from '../../../test-helpers/expect';
import UserFactory from '../../../test-helpers/factories/user';
import { waitForChange, waitForTrue } from '../../../test-helpers/wait';


const bookshelf = initBookshelf($dbConfig);
const User = bookshelf.model('User');
const noop = () => {};

describe('UnwpappedAuth page', () => {
  let user, userAttrs;

  before(async () => {
    userAttrs = UserFactory.build();
    user = await User.create(userAttrs);

    user.set('email_check_hash', null);
    await user.save(null, { method: 'update' });
  });

  after(async () => {
    await user.destroy();
    await bookshelf.knex.raw('DELETE FROM users;');
  });

  describe('Wrapped Register component', () => {
    let userAttrs, user, store;
    const email = 'test@example.com';

    before(async () => {
      userAttrs = UserFactory.build();
      user = await User.create({ ...userAttrs, email });
    });

    beforeEach(() => {
      store = initState();
    });

    after(async () => {
      await user.destroy();
    });

    it('availableUsername should work', async () => {
      const wrapper = mount(
        <RegisterFormV1
          isVisible
          onSubmit={noop}
        />
      );

      expect(
        wrapper
          .find('#registerUsername')
          .getDOMNode()
          .getAttribute('value'),
        'to be empty'
      );

      wrapper.find('#registerFirstName')
        .simulate('change', { target: { value: 'John' } });

      wrapper.find('#registerLastName')
        .simulate('change', { target: { value: 'Smith' } });

      const suggestedUsername = waitForChange(() =>
        wrapper.find('#registerUsername').getDOMNode().getAttribute('value')
      );

      expect(await suggestedUsername, 'not to be empty');
    });

    it('should check on email currently taken', async () => {
      const wrapper = mount(
        <Provider store={store}>
          <RegisterFormV1
            isVisible
            onSubmit={noop}
          />
        </Provider>
      );

      wrapper.find('#registerEmail')
        .simulate('change', { target: { value: email } });

      wrapper.find('#registerForm').simulate('submit');

      const newEmailError = waitForTrue(() =>
        wrapper.find(UnwrappedRegisterFormV1).instance()
          .props.fields.registerEmail.error === 'email_taken'
      );

      expect(await newEmailError, 'to be truthy');
    });

    it('Register form validation', async () => {
      const userAttrs = UserFactory.build();
      const onRegisterUser = sinon.spy();
      const wrapper = mount(
        <Provider store={store}>
          <RegisterFormV1
            isVisible
            onSubmit={onRegisterUser}
          />
        </Provider>
      );
      const register = wrapper.find(UnwrappedRegisterFormV1);

      const changeTextInput = async (id, value, name) => {
        wrapper.find(id).simulate('change', { target: { value } });
        await waitForTrue(() => !register.props().fields[name].error);
      };

      await changeTextInput(
        '#registerUsername',
        userAttrs.username,
        'registerUsername'
      );
      await changeTextInput(
        '#registerPassword',
        userAttrs.password,
        'registerPassword'
      );
      await changeTextInput(
        '#registerPasswordRepeat',
        userAttrs.password,
        'registerPasswordRepeat'
      );
      await changeTextInput(
        '#registerEmail',
        userAttrs.email,
        'registerEmail'
      );

      wrapper.find('#registerAgree')
        .simulate('change', { target: { value: true } });

      await waitForTrue(() => !register.props().fields.registerAgree.error);
      await waitForTrue(() => register.props().form.isValid());

      wrapper.find('#registerForm').simulate('submit');
      await waitForTrue(() => register.props().form.isValid());

      return expect(onRegisterUser.calledWith({
        username: userAttrs.username,
        password: userAttrs.password,
        email: userAttrs.email,
        firstName: '',
        lastName: ''
      }), 'to be true');
    });
  });
});
