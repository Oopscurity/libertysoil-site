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
/* global $dbConfig */
import expect from '../../../test-helpers/expect';
import { login } from '../../../test-helpers/api';
import initBookshelf from '../../../src/api/db';

import UserFactory from '../../../test-helpers/factories/user';
import BookmarkFactory from '../../../test-helpers/factories/bookmark';

const bookshelf = initBookshelf($dbConfig);
const User = bookshelf.model('User');
const Bookmark = bookshelf.model('Bookmark');

describe('Bookmarks', () => {
  describe('GET /api/v1/url', () => {
    const requestDefault = {
      url: '/api/v1/url',
      method: 'GET'
    };

    describe('Not authenticated users', () => {
      it('fails', () =>
        Promise.all([
          expect(
            requestDefault,
            'body to satisfy',
            { error: 'You are not authorized' }
          ),
          expect(
            { ...requestDefault, url: requestDefault.url.concat('?url=%2F') },
            'body to satisfy',
            { error: 'You are not authorized' }
          ),
          expect(
            { ...requestDefault, query: { url: '/' } },
            'body to satisfy',
            { error: 'You are not authorized' }
          )
        ])
      );
    });

    describe('Authenticated users', () => {
      const reqWith = url => ({
        ...requestDefault,
        session: sessionId,
        query: { url }
      });

      let user, sessionId;

      before(async () => {
        const userAttrs = UserFactory.build();
        user = await User.create(userAttrs.username, userAttrs.password, userAttrs.email);
        await user.save({ email_check_hash: null }, { method: 'update' });
        
        sessionId = await login(userAttrs.username, userAttrs.password);
      });

      after(() => user.destroy());

      it('requires url query parameter', () =>
        expect(
          { ...requestDefault, session: sessionId },
          'to fail validation with',
          '"url" parameter is not given'
        )
      );

      it('returns error for external and invalid URL', () => {
        const expectedError = '"url" parameter isn\'t internal to LibertySoil website';
        const listOfInvalidUrls = [
          'google.com', 'www.google.com', 'http://google.com', 'https://google.com',
          'http://www.localhost:8000', 'http://www.localhost.com', 'https://localhost:8000',
          'ftp://localhost:8000/geo', 'ftp://localhost:8000',
          'www', 'http://', '?', '', 123, null
        ];

        const expectations = [];
        for (const url of listOfInvalidUrls) {
          expectations.push(expect(reqWith(url), 'to fail validation with', expectedError));
        }

        return Promise.all(expectations);
      });

      it('returns error for non-existent internal URL', () => {
        const listOfInvalidUrls = [
          '//', 'localhost:8000//', 'http://localhost:8000//',
          '/test', 'http://localhost:8000/test',
          '/123', 'http://localhost:8000/123'
        ];

        const expectations = [];
        for (const url of listOfInvalidUrls) {
          expectations.push(expect(reqWith(url), 'to open not found'));
        }

        return Promise.all(expectations);
      });

      it('handles different versions of URL successfully', () => {
        const listOfValidUrls = [
          '/', 'localhost:8000', 'localhost:8000/', 'http://localhost:8000/',
          '/geo', 'localhost:8000/geo', 'http://localhost:8000/geo'
        ];

        const expectations = [];
        for (const url of listOfValidUrls) {
          expectations.push(expect(reqWith(url), 'to open successfully'));
        }

        return Promise.all(expectations);
      });

      it('handles different char cases successfully', () => {
        const listOfValidUrls = [
          'LOCaLhost:8000', 'LOCALHOST:8000/', 'HTTP://LOCALHOST:8000/',
          '/GEO', 'locAlhOSt:8000/gEo', 'HTTP://LOCALHOST:8000/GEO'
        ];

        const expectations = [];
        for (const url of listOfValidUrls) {
          expectations.push(expect(reqWith(url), 'to open successfully'));
        }

        return Promise.all(expectations);
      });
    });
  });

  describe('POST /api/v1/bookmarks', () => {
    describe('Not authenticated users', () => {
      const bookmark = BookmarkFactory.build();

      it('fails', () =>
        expect(
          { method: 'POST', url: '/api/v1/bookmarks', body: bookmark },
          'body to satisfy',
          { error: 'You are not authorized' }
        )
      );
    });

    describe('Authenticated users', () => {
      let user, sessionId;
      const reqWith = bookmark => ({
        url: '/api/v1/bookmarks',
        method: 'POST',
        body: bookmark,
        session: sessionId,
      });

      before(async () => {
        const userAttrs = UserFactory.build();
        user = await User.create(userAttrs.username, userAttrs.password, userAttrs.email);
        await user.save({ email_check_hash: null }, { method: 'update' });

        sessionId = await login(userAttrs.username, userAttrs.password);
      });

      after(() => user.destroy());

      describe('handle different url versions successfully', () => {
        before(() =>
          Bookmark.collection().query(qb => qb
            .delete()
            .where({ user_id: user.get('id') })
          ).fetch()
        );

        afterEach(() =>
          Bookmark.collection().query(qb => qb
            .delete()
            .where({ user_id: user.get('id') })
          ).fetch()
        );

        it('addresses with 1 level depth', () => {
          const urls = [
            '/s', '/s/',
            'localhost:8000/s', 'localhost:8000/s/',
            'http://localhost:8000/s', 'http://localhost:8000/s/'
          ];
          const bookmark = { title: 'Schools', url: '/s' };
          const response = { success: true, affected: {}, target: bookmark };
          const expectations = [];
          for (const url of urls) {
            expectations.push(
              expect(reqWith({ ...bookmark, url }), 'body to satisfy', response)
            );
          }

          return Promise.all(expectations);
        });

        it('addresses with 2 level depth', () => {
          const username = user.get('username');
          const urls = [
            `/user/${username}`, `/user/${username}/`,
            `localhost:8000/user/${username}/`, `localhost:8000/user/${username}/`,
            `http://localhost:8000/user/${username}/`, `http://localhost:8000/user/${username}/`
          ];
          const bookmark = {
            title: `Posts of ${username} on LibertySoil.org`,
            url: `/user/${username}`
          };

          const response = { success: true, affected: {}, target: bookmark };
          const expectations = [];
          for (const url of urls) {
            expectations.push(
              expect(reqWith({ ...bookmark, url }), 'body to satisfy', response)
            );
          }

          return Promise.all(expectations);
        });
      });
    });
  });
});
