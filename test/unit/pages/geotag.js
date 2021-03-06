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
import { shallow } from 'enzyme';
import i from 'immutable';

import { expect, React } from '../../../test-helpers/expect-unit';

import { UnwrappedGeotagPage } from '../../../src/pages/geotag';


describe('UnwrappedGeotagPage', () => {
  // before(() => {
  //   sinon.stub(console, 'error').callsFake((warning) => { throw new Error(warning); });
  // });

  // after(() => {
  //   console.error.restore();
  // });

  it('MUST render nothing when geotag is not yet loaded', () => {
    const wrapper = shallow(
      <UnwrappedGeotagPage
        comments={i.Map()}
        geotag_posts={i.Map()}
        geotags={i.Map()}
        is_logged_in={false}
        params={{ url_name: 'test' }}
        posts={i.Map()}
        schools={i.Map()}
        users={i.Map()}
      />
    );

    return expect(wrapper.equals(null), 'to be true');
  });
});
