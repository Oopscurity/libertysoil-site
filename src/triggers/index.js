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
import { browserHistory } from 'react-router';
import { toSpreadArray } from '../utils/lang';

import * as a from '../actions';

import {
  addUser, setCurrentUser,
  setLikes, setFavourites,
  setSuggestedUsers, setPersonalizedSuggestedUsers,
  submitResetPassword, submitNewPassword,
  registrationSuccess,
  setQuotes
} from '../actions';


export class ActionsTrigger {
  client;
  dispatch;

  constructor(client, dispatch) {
    this.client = client;
    this.dispatch = dispatch;
  }

  likePost = async (current_user_id, post_id) => {
    try {
      const responseBody = await this.client.like(post_id);

      if (responseBody.success) {
        this.dispatch(setLikes(current_user_id, responseBody.likes, post_id, responseBody.likers));
        await this.syncLikedPosts(current_user_id);
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unlikePost = async (current_user_id, post_id) => {
    try {
      const responseBody = await this.client.unlike(post_id);

      if (responseBody.success) {
        this.dispatch(setLikes(current_user_id, responseBody.likes, post_id, responseBody.likers));
        await this.syncLikedPosts(current_user_id);
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  likeHashtag = async (name) => {
    try {
      const response = await this.client.likeHashtag(name);

      if (response.success) {
        this.dispatch(a.hashtags.addLikedHashtag(response.hashtag));
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unlikeHashtag = async (name) => {
    try {
      const response = await this.client.unlikeHashtag(name);

      if (response.success) {
        this.dispatch(a.hashtags.removeLikedHashtag(response.hashtag));
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  likeSchool = async (url_name) => {
    try {
      const response = await this.client.likeSchool(url_name);

      if (response.success) {
        this.dispatch(a.schools.addLikedSchool(response.school));
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unlikeSchool = async (url_name) => {
    try {
      const response = await this.client.unlikeSchool(url_name);

      if (response.success) {
        this.dispatch(a.schools.removeLikedSchool(response.school));
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  likeGeotag = async (url_name) => {
    try {
      const response = await this.client.likeGeotag(url_name);

      if (response.success) {
        this.dispatch(a.geotags.addLikedGeotag(response.geotag));
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unlikeGeotag = async (url_name) => {
    try {
      const response = await this.client.unlikeGeotag(url_name);

      if (response.success) {
        this.dispatch(a.geotags.removeLikedGeotag(response.geotag));
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  syncLikedPosts = async (current_user_id) => {
    try {
      const likedPosts = await this.client.userLikedPosts();

      this.dispatch(a.river.setPostsToLikesRiver(current_user_id, likedPosts));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  favPost = async (current_user_id, post_id) => {
    try {
      const responseBody = await this.client.fav(post_id);

      if (responseBody.success) {
        this.dispatch(setFavourites(current_user_id, responseBody.favourites, post_id, responseBody.favourers));
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unfavPost = async (current_user_id, post_id) => {
    try {
      const responseBody = await this.client.unfav(post_id);

      if (responseBody.success) {
        this.dispatch(setFavourites(current_user_id, responseBody.favourites, post_id, responseBody.favourers));
      } else {
        this.dispatch(a.messages.addError('internal server error. please try later'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  createPost = async (type, data) => {
    try {
      const result = await this.client.createPost(type, data);
      this.dispatch(a.river.addPostToRiver(result));

      const userTags = await this.client.userTags();
      this.dispatch(a.tags.setUserTags(userTags));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  updateUserInfo = async (user) => {
    let status = false;
    try {
      const res = await this.client.updateUser(user);

      if ('user' in res) {
        this.dispatch(a.messages.addMessage('Saved successfully'));
        this.dispatch(addUser(res.user));
        status = true;
      }
    } catch (e) {
      if (('body' in e.response) && ('error' in e.response.body)) {
        this.dispatch(a.messages.addError(e.response.body.error));
      } else {
        this.dispatch(a.messages.addError(e.message));
      }
    }
    return status;
  };

  changePassword = async (old_password, new_password1, new_password2) => {
    if (old_password.trim() == '' || new_password1.trim() == '' || new_password2.trim() == '') {
      this.dispatch(a.messages.addError('Some of the fields are empty'));
      return false;
    }

    if (new_password1 !== new_password2) {
      this.dispatch(a.messages.addError('Passwords do not match'));
      return false;
    }

    let success = false;
    try {
      const res = await this.client.changePassword(old_password, new_password1);

      if ('success' in res && res.success === true) {
        this.dispatch(a.messages.addMessage('Password is changed successfully'));
        success = true;
      }
    } catch (e) {
      if (('body' in e.response) && ('error' in e.response.body)) {
        this.dispatch(a.messages.addError(e.response.body.error));
      } else {
        this.dispatch(a.messages.addError(e.message));
      }
    }

    return success;
  };


  followUser = async (user) => {
    try {
      const res = await this.client.follow(user.username);

      if ('user1' in res) {
        this.dispatch(addUser(res.user1));
        this.dispatch(addUser(res.user2));
      }

      this.dispatch(a.river.clearRiver());
      this.loadPostRiver();
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unfollowUser = async (user) => {
    try {
      const res = await this.client.unfollow(user.username);

      if ('user1' in res) {
        this.dispatch(addUser(res.user1));
        this.dispatch(addUser(res.user2));
      }

      this.dispatch(a.river.clearRiver());
      this.loadPostRiver();
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  ignoreUser = async (user) => {
    try {
      await this.client.ignoreUser(user.username);
      const result = await this.client.userSuggestions();

      this.dispatch(setPersonalizedSuggestedUsers(result));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  login = async (username, password) => {
    this.dispatch(a.messages.removeAllMessages());

    let user = null;

    try {
      const result = await this.client.login({ username, password });

      if (!result.success) {
        this.dispatch(setCurrentUser(null));
        this.dispatch(a.messages.addError('Invalid username or password'));
        return;
      }

      user = result.user;
    } catch (e) {
      this.dispatch(setCurrentUser(null));

      if (e.response && ('body' in e.response) && ('error' in e.response.body)) {
        this.dispatch(a.messages.addError(e.response.body.error));
      } else if (e.status === 401) {
        this.dispatch(a.messages.addError('Invalid username or password'));
      } else {
        // FIXME: this should be reported to developers instead (use Sentry?)
        console.warn(e);  // eslint-disable-line no-console
        this.dispatch(a.messages.addError('Server error: please retry later'));
      }

      return;
    }

    try {
      this.dispatch(setCurrentUser(user));
      this.dispatch(setLikes(user.id, user.liked_posts.map(like => like.id)));
      this.dispatch(setFavourites(user.id, user.favourited_posts.map(fav => fav.id)));

      if (!user.more || user.more.first_login) {
        browserHistory.push('/induction');
      } else {
        browserHistory.push('/suggestions');
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  resetPassword = async (email) => {
    try {
      await this.client.resetPassword(email);
      this.dispatch(submitResetPassword());
    } catch (e) {
      this.dispatch(a.messages.addError('Invalid username or password'));
    }
  };

  newPassword = async (hash, password, password_repeat) => {
    try {
      await this.client.newPassword(hash, password, password_repeat);
      this.dispatch(submitNewPassword());
    } catch (e) {
      if (('body' in e.response) && ('error' in e.response.body)) {
        this.dispatch(a.messages.addError(e.response.body.error));
      } else {
        this.dispatch(a.messages.addError(e.message));
      }
    }
  };

  registerUser = async (username, password, email, firstName, lastName) => {
    this.dispatch(a.messages.removeAllMessages());

    // FIXME: disable form
    try {
      const result = await this.client.registerUser({ username, password, email, firstName, lastName });

      if (result.success) {
        this.dispatch(registrationSuccess());
      }
    } catch (e) {
      // FIXME: enable form again

      if (e.response && ('error' in e.response.body)) {
        // FIXME: enable form again
        const errors = e.response.body.error;
        let message = '';
        for (const i in errors) {
          errors[i].map((el) => {
            message += `${el}\n`;
          });
        }

        this.dispatch(a.messages.addError(message));
      } else {
        this.dispatch(a.messages.addError('Server seems to have problems. Retry later, please'));
      }
    }
  };

  setQuotes = async () => {
    try {
      const result = await this.client.getQuotes();

      this.dispatch(setQuotes(result));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  }

  deletePost = async (post_uuid) => {
    try {
      const result = await this.client.deletePost(post_uuid);

      if (result.error) {
        throw new Error(result.error);
      }

      this.dispatch(a.posts.removePost(post_uuid));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      throw e;
    }
  };

  loadUserRecentTags = async () => {
    try {
      const geotags = await this.client.userRecentGeotags();
      const schools = await this.client.userRecentSchools();
      const hashtags = await this.client.userRecentHashtags();

      this.dispatch(a.tags.setUserRecentTags({ geotags, schools, hashtags }));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  updatePost = async (post_uuid, post_fields) => {
    try {
      const result = await this.client.updatePost(post_uuid, post_fields);
      this.dispatch(a.posts.addPost(result));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  updateGeotag = async (geotag_uuid, geotag_fields) => {
    try {
      const result = await this.client.updateGeotag(geotag_uuid, geotag_fields);
      this.dispatch(a.geotags.addGeotag(result));

      return result;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      throw e;
    }
  };

  updateHashtag = async (hashtag_uuid, hashtag_fields) => {
    try {
      const result = await this.client.updateHashtag(hashtag_uuid, hashtag_fields);
      this.dispatch(a.hashtags.addHashtag(result));

      return result;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      throw e;
    }
  };

  updateSchool = async (school_uuid, school_fields) => {
    try {
      const result = await this.client.updateSchool(school_uuid, school_fields);
      this.dispatch(a.schools.addSchool(result));

      return result;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      throw e;
    }
  };

  loadSchools = async () => {
    try {
      const result = await this.client.schools();
      this.dispatch(a.schools.setSchools(result));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  loadInitialSuggestions = async () => {
    try {
      const result = await this.client.initialSuggestions();

      this.dispatch(setSuggestedUsers(result));

      return result;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      return false;
    }
  };

  loadPersonalizedSuggestions = async () => {
    try {
      const result = await this.client.userSuggestions();

      this.dispatch(setPersonalizedSuggestedUsers(result));

      return result;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      return false;
    }
  };

  loadPostRiver = async (offset) => {
    this.dispatch(a.ui.setProgress('loadRiverInProgress', true));

    try {
      const result = await this.client.subscriptions(offset);
      this.dispatch(a.river.setPostsToRiver(result));
      this.dispatch(a.ui.setProgress('loadRiverInProgress', false));
      return result;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      this.dispatch(a.ui.setProgress('loadRiverInProgress', false));
      return false;
    }
  };

  loadTagCloud = async () => {
    try {
      const result = await this.client.tagCloud();
      this.dispatch(a.hashtags.setHashtagCloud(result));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  checkSchoolExists = async (name) => {
    let exists;
    try {
      exists = await this.client.checkSchoolExists(name);
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      return false;
    }

    return exists;
  };

  checkGeotagExists = async (name) => {
    let exists;
    try {
      exists = await this.client.checkGeotagExists(name);
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      return false;
    }

    return exists;
  };

  loadSchoolCloud = async () => {
    try {
      const result = await this.client.schoolCloud();
      this.dispatch(a.schools.setSchools(result));
      this.dispatch(a.schools.setSchoolCloud(result));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  loadGeotagCloud = async () => {
    try {
      const result = await this.client.geotagCloud();
      this.dispatch(a.geotags.setGeotagCloud(result));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  followTag = async (name) => {
    try {
      const result = await this.client.followTag(name);
      this.dispatch(a.hashtags.addUserFollowedHashtag(result.hashtag));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unfollowTag = async (name) => {
    try {
      const result = await this.client.unfollowTag(name);
      this.dispatch(a.hashtags.removeUserFollowedHashtag(result.hashtag));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  followSchool = async (name) => {
    try {
      const result = await this.client.followSchool(name);
      this.dispatch(a.schools.addUserFollowedSchool(result.school));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unfollowSchool = async (name) => {
    try {
      const result = await this.client.unfollowSchool(name);
      this.dispatch(a.schools.removeUserFollowedSchool(result.school));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  followGeotag = async (urlName) => {
    try {
      const result = await this.client.followGeotag(urlName);
      this.dispatch(a.geotags.addUserFollowedGeotag(result.geotag));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unfollowGeotag = async (urlName) => {
    try {
      const result = await this.client.unfollowGeotag(urlName);
      this.dispatch(a.geotags.removeUserFollowedGeotag(result.geotag));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  removeMessage = (id) => {
    this.dispatch(a.messages.removeMessage(id));
  };

  loadUserTags = async () => {
    const userTags = await this.client.userTags();
    this.dispatch(a.tags.setUserTags(userTags));
  };

  showRegisterForm = async () => {
    this.dispatch(a.ui.showRegisterForm());
  };

  uploadPicture = async ({ picture, ...options }) => {
    let img;
    try {
      const original = await this.client.uploadImage([picture]);
      const originalId = original.attachments[0].id;

      const processed = await this.client.processImage(originalId, toSpreadArray(options));

      img = {
        attachment_id: processed.attachment.id,
        url: processed.attachment.s3_url
      };
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      throw e;
    }

    return img;
  };

  createComment = async (postId, comment) => {
    this.dispatch(a.comments.createCommentStart(postId, comment));

    try {
      const responseBody = await this.client.createComment(postId, comment);

      if (responseBody) {
        if (responseBody.error) {
          this.dispatch(a.comments.createCommentFailure(postId, responseBody.error));
        } else {
          this.dispatch(a.comments.setPostComments(postId, responseBody));
          this.dispatch(a.comments.createCommentSuccess(postId));
        }
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  deleteComment = async (postId, commentId) => {
    this.dispatch(a.comments.deleteCommentStart(postId, commentId));

    try {
      const responseBody = await this.client.deleteComment(postId, commentId);

      if (responseBody) {
        if (responseBody.error) {
          this.dispatch(a.comments.deleteCommentFailure(postId, commentId, responseBody.error));
        } else {
          this.dispatch(a.comments.setPostComments(postId, responseBody));
          this.dispatch(a.comments.deleteCommentSuccess(postId, commentId));
        }
      }
    } catch (e) {
      this.dispatch(a.comments.deleteCommentFailure(postId, commentId, e.message));
    }
  };

  saveComment = async (postId, commentId, text) => {
    this.dispatch(a.comments.saveCommentStart(postId, commentId));

    try {
      const responseBody = await this.client.saveComment(postId, commentId, text);

      if (responseBody) {
        if (responseBody.error) {
          this.dispatch(a.comments.saveCommentFailure(postId, commentId, responseBody.error));
        } else {
          this.dispatch(a.comments.setPostComments(postId, responseBody));
          this.dispatch(a.comments.saveCommentSuccess(postId, commentId));
        }
      }
    } catch (e) {
      this.dispatch(a.comments.saveCommentFailure(postId, commentId, e.message));
    }
  };

  getCountries = async () => {
    try {
      const response = await this.client.countries();
      this.dispatch(a.geo.setCountries(response));
    } catch (e) {
      console.error(`Failed to fetch countries: ${e}`);  // eslint-disable-line no-console
    }
  }

  search = async (query) => {
    try {
      const response = await this.client.search(query);
      this.dispatch(a.search.setSearchResults(response));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  }
}
