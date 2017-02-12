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
import React, { PropTypes } from 'react';
import { pick } from 'lodash';

import {
  Page,
  PageMain,
  PageHero,
  PageBody,
  PageContent
}                       from '../../components/page';
import Header           from '../../components/header';
import MapboxMap        from '../../components/mapbox-map';
import HeaderLogo       from '../../components/header-logo';
import CreatePost       from '../../components/create-post';
import TagBreadcrumbs   from '../../components/breadcrumbs/tag-breadcrumbs';
import Footer           from '../../components/footer';
import TagHeader        from '../../components/tag-header';
import Sidebar          from '../../components/sidebar';
import SidebarAlt       from '../../components/sidebarAlt';
import AddedTags        from '../../components/post/added-tags';
import UpdatePicture    from '../../components/update-picture/update-picture';
import Tag              from '../../components/tag';
import { TAG_SCHOOL, TAG_LOCATION, TAG_HASHTAG, TAG_HEADER_SIZE, DEFAULT_HEADER_PICTURE } from '../../consts/tags';

function formInitialTags(type, value) {
  switch (type) {
    case TAG_SCHOOL:
      return { schools: value };
    case TAG_HASHTAG:
      return { hashtags: value };
    case TAG_LOCATION:
      return { geotags: value };
    default:
      return {};
  }
}

function getPageCaption(type, name) {
  let caption;
  switch (type) {
    case TAG_LOCATION: {
      caption = [`${name} `, <span className="page__caption_highlight" key="caption">Education</span>];
      break;
    }
    default:
      caption = name;
  }

  return (
    <div className="page_head">
      <h1 className="page_head__title">
        {caption}
      </h1>
      <div className="page_head__icon">
        <Tag size="BIG" type={type} />
      </div>
    </div>
  );
}

function GeotagPageHero({ geotag }) {
  let type = geotag.type;
  const location = {
    lat: geotag.get('lat'),
    lon: geotag.get('lon')
  };

  // A lot of admin divisions don't have lat/lon. Attempt to take coords from the country.
  if (!(location.lat && location.lon) && geotag.get('country')) {
    type = 'Country';
    location.lat = geotag.getIn(['country', 'lat']);
    location.lon = geotag.getIn(['country', 'lon']);
  }

  let zoom;
  switch (type) {
    case 'Planet': zoom = 3; break;
    case 'Continent': zoom = 4; break;
    case 'Country': zoom = 5; break;
    case 'AdminDivision1': zoom = 6; break;
    case 'City': zoom = 12; break;
    default: zoom = 10;
  }

  if (location.lat && location.lon) {
    return (
      <PageHero>
        <MapboxMap
          className="page__hero_map"
          frozen
          viewLocation={location}
          zoom={zoom}
        />
      </PageHero>
    );
  }

  return <PageHero url="/images/hero/welcome.jpg" />;
}

function TagPageHero({ type, tag, url, editable, onSubmit, limits, preview, flexible }) {
  switch (type) {
    case TAG_HASHTAG:
    case TAG_SCHOOL:
      return (
        <PageHero url={url}>
          {editable &&
            <div className="layout__grid layout-align_vertical layout-align_center layout__grid-full update_picture__container">
              <div className="layout__grid_item">
                <UpdatePicture
                  flexible={flexible}
                  limits={limits}
                  preview={preview}
                  what="header image"
                  where={(<span className="font-bold">{tag.get('name')}</span>)}
                  onSubmit={onSubmit}
                />
              </div>
            </div>
          }
        </PageHero>
      );
    case TAG_LOCATION:
      return <GeotagPageHero geotag={tag} />;
    default:
      return null;
  }
}

export default class BaseTagPage extends React.Component {
  static displayName = 'BaseTagPage';

  static propTypes = {
    actions: PropTypes.shape({
      resetCreatePostForm: PropTypes.func,
      updateCreatePostForm: PropTypes.func
    }).isRequired,
    children: PropTypes.node,
    postsAmount: PropTypes.number,
    tag: PropTypes.shape({}).isRequired,
    type: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.postsAmount = null;
    this.state = {
      form: false,
      head_pic: null
    };
  }

  componentWillMount() {
    this.postsAmount = this.props.postsAmount;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.form) {
      if (this.postsAmount != nextProps.postsAmount) {
        this.setState({ form: false });
      }
    }

    this.postsAmount = nextProps.postsAmount;
  }

  componentWillUnmount() {
    this.props.actions.resetCreatePostForm();
  }

  _getNewPictures() {
    const pictures = {};

    if (this.state.head_pic) {
      pictures.head_pic = this.state.head_pic.production;
    }

    return pictures;
  }

  _clearPreview() {
    this.setState({ head_pic: null });
  }

  addPicture = async ({ production, preview }) => {
    if (production) {
      const _production = { picture: production.picture };

      // properties assign order is important
      _production.crop = pick(production.crop, ['left', 'top', 'right', 'bottom']);

      if (production.crop.width > TAG_HEADER_SIZE.BIG.width) {
        _production.scale = { wRatio: TAG_HEADER_SIZE.BIG.width / production.crop.width };
      } else {
        _production.scale = { wRatio: TAG_HEADER_SIZE.NORMAL.width / production.crop.width };
      }

      this.setState({ head_pic: { production: _production, preview } });
    } else {
      this.setState({ head_pic: null });
    }
  };

  toggleForm = () => {
    if (!this.state.form) {
      const { tag, type } = this.props;
      this.props.actions.resetCreatePostForm();
      this.props.actions.updateCreatePostForm(formInitialTags(type, [tag]));
    }

    this.setState({ form: !this.state.form });
  };

  render() {
    const {
      is_logged_in,
      current_user,
      create_post_form,
      actions,
      triggers,
      type,
      tag,
      postsAmount,
      editable
    } = this.props;

    const name = tag.get('name') || tag.get('url_name');
    const pageCaption = getPageCaption(type, name);

    let headerPictureUrl;
    if (this.state.head_pic) {
      headerPictureUrl = this.state.head_pic.preview.url;
    } else if (tag.getIn(['more', 'head_pic', 'url'])) {
      headerPictureUrl = tag.getIn(['more', 'head_pic', 'url']);
    } else {
      headerPictureUrl = DEFAULT_HEADER_PICTURE;
    }

    let createPostForm;
    let addedTags;
    let tagsAttached = false;
    if (is_logged_in) {
      if (this.state.form) {
        const geotags = create_post_form.get('geotags');
        const hashtags = create_post_form.get('hashtags');
        const schools = create_post_form.get('schools');
        tagsAttached = geotags.size || hashtags.size || schools.size;
        tagsAttached = !!tagsAttached;

        createPostForm = (
          <CreatePost
            actions={actions}
            addedGeotags={geotags}
            addedHashtags={hashtags}
            addedSchools={schools}
            defaultText={create_post_form.get('text')}
            triggers={triggers}
            userRecentTags={current_user.get('recent_tags')}
          />
        );
        addedTags = (
          <AddedTags
            geotags={geotags}
            hashtags={hashtags}
            schools={schools}
          />
        );
      }
    }

    return (
      <div>
        <Header is_logged_in={is_logged_in} current_user={current_user}>
          <HeaderLogo small />
          <TagBreadcrumbs type={type} tag={tag} />
        </Header>

        <Page>
          <PageMain className={!tagsAttached && 'page__main--without-right'}>
            <PageBody className="page__body-up">
              <Sidebar current_user={current_user} />
              <PageContent>
                {createPostForm}
                {pageCaption}
                <TagPageHero
                  editable={editable}
                  flexible
                  limits={{ min: TAG_HEADER_SIZE.MIN, max: TAG_HEADER_SIZE.BIG }}
                  preview={TAG_HEADER_SIZE.PREVIEW}
                  tag={tag}
                  type={type}
                  url={headerPictureUrl}
                  onSubmit={this.addPicture}
                />
                <TagHeader
                  current_user={current_user}
                  editable={editable}
                  is_logged_in={is_logged_in}
                  newPost={this.toggleForm}
                  postsAmount={postsAmount}
                  tag={tag}
                  triggers={triggers}
                  type={type}
                />
                <div className="layout__space-double" />
                <div className="layout__row">
                  {this.props.children}
                </div>
              </PageContent>
              {tagsAttached &&
                <SidebarAlt>
                  {addedTags}
                </SidebarAlt>
              }
            </PageBody>
          </PageMain>
        </Page>

        <Footer />
      </div>
    );
  }
}
