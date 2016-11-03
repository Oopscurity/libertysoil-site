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
/* eslint-env node, mocha */
/* global $dbConfig */
import { serialize } from 'cookie';

import expect from '../../../test-helpers/expect';
import initBookshelf from '../../../src/api/db';
import { login } from '../../../test-helpers/api';
import { initState } from '../../../src/store';
import { ActionsTrigger } from '../../../src/triggers';
import ApiClient from '../../../src/api/client';
import { API_HOST } from '../../../src/config';
import UserFactory from '../../../test-helpers/factories/user';


let bookshelf = initBookshelf($dbConfig);
let User = bookshelf.model('User');

describe('ActionsTrigger', () => {
  describe('Anonymous user', async () => {
    describe('#newPassword', async() => {
      let user, userAttrs, client;

      beforeEach(async () => {
        userAttrs = UserFactory.build();
        user = await User.create(userAttrs.username, userAttrs.password, userAttrs.email);
        client = new ApiClient(API_HOST);
      });

      afterEach(async () => {
        await user.destroy();
      });

      it('should dispatch error for non existing hash', async () => {
        const store = initState();
        const triggers = new ActionsTrigger(client, store.dispatch);
        await triggers.newPassword('nonexistinghash', 'test', 'test');
        expect(store.getState().get('messages').first().get('message'), 'to equal', 'Unauthorized');
      });

      it('should work', async () => {
        const store = initState();
        const triggers = new ActionsTrigger(client, store.dispatch);
        user.set('reset_password_hash', 'hash');
        await user.save(null, { method: 'update' });

        await triggers.newPassword('hash', 'test', 'test');
        expect(store.getState().getIn(['ui', 'submitNewPassword']), 'to be true');
      });

      it('validation should work when passwords do not match', async () => {
        const store = initState();
        const triggers = new ActionsTrigger(client, store.dispatch);
        user.set('reset_password_hash', 'hash');
        await user.save(null, { method: 'update' });

        await triggers.newPassword('hash', 'test1', 'test2');
        expect(store.getState().get('messages').first().get('message'), 'to equal', '"password" and "password_repeat" do not exact match.');
      });

      it('validation should work when no password_repeat provided', async () => {
        const store = initState();
        const triggers = new ActionsTrigger(client, store.dispatch);
        user.set('reset_password_hash', 'hash');
        await user.save(null, { method: 'update' });

        await triggers.newPassword('hash', 'test1');
        expect(store.getState().get('messages').first().get('message'), 'to equal', '"password" or "password_repeat" parameter is not provided');
      });
    });

    describe('#login', async () => {
      it('should dispatch correct error for non existing user', async () => {
        const store = initState();
        const client = new ApiClient(API_HOST);
        const triggers = new ActionsTrigger(client, store.dispatch);
        await triggers.login('nonexisting', 'password');

        expect(store.getState().get('messages').first().get('message'), 'to equal', 'Invalid username or password');
      });

      it('should dispatch correct error for user with not validated email', async () => {
        const userAttrs = UserFactory.build();
        const user = await User.create(userAttrs.username, userAttrs.password, userAttrs.email);
        const store = initState();
        const client = new ApiClient(API_HOST);
        const triggers = new ActionsTrigger(client, store.dispatch);
        await triggers.login(userAttrs.username, userAttrs.password);

        expect(store.getState().get('messages').first().get('message'), 'to equal', 'Please follow the instructions mailed to you during registration.');
        await user.destroy();
      });
    });
  });

  describe('Authenticated User', async () => {
    let user, triggers, client;

    beforeEach(async () => {
      const userAttrs = UserFactory.build();
      user = await User.create(userAttrs.username, userAttrs.password, userAttrs.email);

      user.set('email_check_hash', null);
      await user.save(null, { method: 'update' });
      const sessionId = await login(userAttrs.username, userAttrs.password);
      const headers = {
        "cookie": serialize('connect.sid', sessionId)
      };

      client = new ApiClient(API_HOST, { headers });
    });

    afterEach(async () => {
      await user.destroy();
      await bookshelf.knex('posts').del();
    });

    it('createPost should work', async () => {
      const store = initState();
      triggers = new ActionsTrigger(client, store.dispatch);
      await triggers.createPost('short_text', { text: 'lorem ipsum' });

      expect(store.getState().get('river').size, 'to equal', 1);
    });

    it('#updateUserInfo should work', async () => {
      let store = initState();
      triggers = new ActionsTrigger(client, store.dispatch);

      await triggers.updateUserInfo({});
      expect(store.getState().get('messages').first().get('message'), 'to equal', 'Bad Request');

      store = initState();
      triggers = new ActionsTrigger(client, store.dispatch);

      await triggers.updateUserInfo({ more: {} });
      expect(store.getState().get('messages').first().get('message'), 'to equal', 'Saved successfully');
    });

  });
});
