import React from 'react';
import { connect } from 'react-redux';
import request from 'superagent';
import _ from 'lodash';

import NotFound from './not-found'
import Header from '../components/header';
import Footer from '../components/footer';
import River from '../components/river_of_posts';
import Followed from '../components/most_followed_people';
import Tags from '../components/popular_tags';
import CurrentUser from '../components/current-user';
import { TextPostComponent } from '../components/post'
import {API_HOST} from '../config';
import {getStore, addPost} from '../store';
import ReactDisqusThread from '../scripts/disqus-thread';


class PostPage extends React.Component {
  async componentWillMount() {
    try {
      let result = await request.get(`${API_HOST}/api/v1/post/${this.props.params.uuid}`);
      getStore().dispatch(addPost(result.body));
    } catch (e) {
    }
  }

  render() {
    // FIXME: add check for post existence
    const current_user = this.props.current_user;
    const post_uuid = this.props.params.uuid;

    if (!(post_uuid in this.props.posts)) {
      // not loaded yet
      return <script/>
    }

    const current_post = this.props.posts[post_uuid];

    if (current_post === false) {
      return <NotFound/>
    }

    return (
      <div>
        <Header is_logged_in={this.props.is_logged_in} current_user={current_user} />
        <div className="page__container">
          <div className="page__body">
            <div className="page__sidebar">
              <div className="layout__row">
                <CurrentUser user={current_user} />
              </div>
              <div className="layout__row">
                <a href="/">News feed</a>
              </div>
            </div>

            <div className="page__content">
              <TextPostComponent post={current_post} author={this.props.users[current_post.user_id]} key={current_post.id} full_post={true} />
              <ReactDisqusThread
                  shortname="lstest"
                  identifier={current_post.id}
                  title="Post"
                  url={`http://alpha.libertysoil.org/post/${current_post.id}`}
                  categoryId={current_post.type}/>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
}

function select(state) {
  return state.toJS();
}

export default connect(select)(PostPage);
