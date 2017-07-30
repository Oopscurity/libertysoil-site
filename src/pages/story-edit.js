/*
 This file is a part of libertysoil.org website
 Copyright (C) 2017  Loki Education (Social Enterprise)

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
import Helmet from 'react-helmet';
import Gravatar from 'react-gravatar';
import { truncate } from 'grapheme-utils';
import { Link } from 'react-router';
import { Map as ImmutableMap } from 'immutable';
import { Dante, DanteEditor } from 'Dante2/lib';

import {
  uuid4 as uuid4PropType,
  mapOf as mapOfPropType
} from '../prop-types/common';
import {
  ArrayOfPostsId as ArrayOfPostsIdPropType,
  MapOfPosts as MapOfPostsPropType
} from '../prop-types/posts';
import { CommentsByCategory as CommentsByCategoryPropType } from '../prop-types/comments';
import {
  CurrentUser as CurrentUserPropType,
  MapOfUsers as MapOfUsersPropType
} from '../prop-types/users';

import {
  Page,
  PageMain,
  PageBody,
  PageContent
} from '../components/page';
import Breadcrumbs from '../components/breadcrumbs/breadcrumbs';
import HeaderLogo from '../components/header-logo';
import Header from '../components/header';
import Footer from '../components/footer';
import { ShortTextPost, PostWrapper } from '../components/post';
import Sidebar from '../components/sidebar';
import RelatedPosts from '../components/related-posts';
import SidebarAlt from '../components/sidebarAlt';
import { API_HOST } from '../config';
import ApiClient from '../api/client';
import { addPost, setRelatedPosts } from '../actions/posts';
import { addError } from '../actions/messages';
import { ActionsTrigger } from '../triggers';
import { createSelector, currentUserSelector } from '../selectors';
import { URL_NAMES, getUrl } from '../utils/urlGenerator';

import NotFound from './not-found';

const EDITOR_CONFIG = Dante.defaultOptions();
EDITOR_CONFIG.read_only = false;

export class UnwrappedStoryEditPage extends React.Component {
  static displayName = 'UnwrappedStoryEditPage';

  static propTypes = {
    comments: CommentsByCategoryPropType.isRequired,
    current_user: CurrentUserPropType,
    is_logged_in: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      uuid: uuid4PropType.isRequired
    }).isRequired,
    posts: MapOfPostsPropType.isRequired,
    related_posts: mapOfPropType(uuid4PropType, ArrayOfPostsIdPropType),
    users: MapOfUsersPropType.isRequired
  };

  static async fetchData(router, store, client) {
    if (!('uuid' in router.params)) {
      return 200;
    }

    try {
      const post = await client.postInfo(router.params.uuid);
      store.dispatch(addPost(post));
    } catch (e) {
      store.dispatch(addPost({ id: router.params.uuid, error: true }));
      return 404;
    }

    try {
      const relatedPosts = await client.relatedPosts(router.params.uuid);
      store.dispatch(setRelatedPosts(router.params.uuid, relatedPosts));
    } catch (e) {
      store.dispatch(addError(e.message));
    }

    return 200;
  }

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      html: {}
    };

    if (props.isEditing) {
      const story = props.posts.get(props.params.uuid);
      if (story) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.html = story.get('html');
      }
    }
  }

  componentDidMount() {
    if (this.props.isEditing) {
      const story = this.props.posts.get(this.props.params.uuid);
      if (story) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState(state => ({ ...state, html: story.get('html') }));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const willBeEditing = !this.props.isEditing && nextProps.isEditing !== this.props.isEditing; // && nextProps.isEditing
    const uuidChanged = nextProps.params.uuid !== this.props.params.uuid;

    if (willBeEditing || uuidChanged || !this.state.html) {
      const story = nextProps.posts.get(nextProps.params.uuid);
      if (story) {
        this.setState(state => ({ ...state, html: story.get('html') }));
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.editorInnerHTML = { __html: nextState.html };
  }

  handleSubmit = async () => {
    this.editor.get('nativeEditor').getData();
  };

  render() {
    const {
      comments,
      current_user,
      is_logged_in,
      params,
      posts,
      related_posts,
      ui,
      users
    } = this.props;

    const post_uuid = params.uuid;

    // const current_post = posts.get(post_uuid);
    // if (!current_post) {
    //   // not loaded yet
    //   return null;
    // }

    // if (current_post.get('error')) {
    //   return <NotFound />;
    // }

    // const author = users.get(current_post.get('user_id'));

    // const client = new ApiClient(API_HOST);
    // const triggers = new ActionsTrigger(client, this.props.dispatch);

    // const relatedPosts = (related_posts.get(current_post.get('id')) || i.List())
    //   .map(id => posts.get(id));

    // const authorUrl = getUrl(URL_NAMES.USER, { username: author.username });
    // let authorName = author.username;

    // if (author.more && (author.more.firstName || author.more.lastName)) {
    //   authorName = `${author.more.firstName} ${author.more.lastName}`;
    // }

    /* eslint-disable react/no-danger */
    return (
      <div>
        <Header current_user={current_user} is_logged_in={is_logged_in}>
          <HeaderLogo />
        </Header>

        <Page>
          <PageMain>
            <PageBody>
              <Sidebar isTruncated />
              <PageContent className="stories">
                <DanteEditor
                  className="stories__form story"
                  config={EDITOR_CONFIG}
                  content={this.editorInnerHTML}
                />
              </PageContent>
            </PageBody>
          </PageMain>
        </Page>

        <Footer />
      </div>
    );
    /* eslint-enable react/no-danger */
  }
}

const selector = createSelector(
  currentUserSelector,
  state => state.get('comments'),
  state => state.get('posts'),
  state => state.get('related_posts'),
  state => state.get('ui'),
  state => state.get('users'),
  (_, props) => !('uuid' in props.params),
  (current_user, comments, posts, related_posts, ui, users, isEditing) => ({
    comments,
    isEditing,
    posts,
    related_posts,
    ui,
    users,
    ...current_user
  })
);

export default connect(selector)(UnwrappedStoryEditPage);
