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
import { TestUtils, expect, React } from '../../../test-helpers/expect-unit';

import { GeotagPage } from '../../../src/pages/geotag';
import NotFound from '../../../src/pages/not-found';

describe('GeotagPage', () => {
  it('MUST render nothing when geotag is not yet loaded', () => {
    const wrapper = shallow(
      <GeotagPage
        geotag_posts={{}}
        geotags={{}}
        params={{ url_name: 'test' }}
      />
    );

    return expect(wrapper.equals(null), 'to be true');
  });

  it('MUST render <NotFound /> for non existing geotag', () => {
    const renderer = TestUtils.createRenderer();

    renderer.render(
      <GeotagPage
        geotag_posts={{}}
        geotags={{ test: {} }}
        params={{ url_name: 'test' }}
      />
    );

    return expect(renderer, 'to have rendered', <NotFound />);
  });
});
