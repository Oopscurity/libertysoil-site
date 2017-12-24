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
import { omit } from 'lodash';
import { browserHistory } from 'react-router';
import { Map as ImmutableMap } from 'immutable';
import t from 't8on';

import { DEFAULT_LOCALE } from '../consts/localization';
import { isStorageAvailable } from '../utils/browser';
import { toSpreadArray } from '../utils/lang';
import * as a from '../actions';

const isBrowser = typeof window !== 'undefined';

const canUseStorage = isBrowser
  && process.env.DB_ENV !== 'test'
  && process.env.DB_ENV !== 'travis'
  && isStorageAvailable('localStorage');

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
        this.dispatch(a.users.setLikes(current_user_id, responseBody.likes, post_id, responseBody.likers));
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
        this.dispatch(a.users.setLikes(current_user_id, responseBody.likes, post_id, responseBody.likers));
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
        this.dispatch(a.users.setFavourites(current_user_id, responseBody.favourites, post_id, responseBody.favourers));
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
        this.dispatch(a.users.setFavourites(current_user_id, responseBody.favourites, post_id, responseBody.favourers));
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
      this.dispatch(a.posts.createPost(result));

      const userTags = await this.client.userTags();
      this.dispatch(a.tags.setUserTags(userTags));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  loadUserInfo = async (username) => {
    let status = false;
    try {
      const user = await this.client.userInfo(username);

      if ('id' in user) {
        this.dispatch(a.users.addUser(user));
        status = true;
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.messages));
    }
    return status;
  };

  updateUserInfo = async (user, isLoggedIn = true) => {
    if (!isLoggedIn) {
      this.dispatch(a.messages.addMessage('Saved successfully'));
      this.dispatch(a.users.addUser({ id: null, ...user }));
      return true;
    }

    let status = false;
    try {
      const res = await this.client.updateUser(user);

      if ('user' in res) {
        this.dispatch(a.messages.addMessage('Saved successfully'));
        this.dispatch(a.users.addUser(res.user));
        status = true;
      }
    } catch (e) {
      if (e.response && e.response.error) {
        this.dispatch(a.messages.addError(e.response.error));
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
      this.dispatch(a.messages.addError(e.message));
    }

    return success;
  };


  followUser = async (username) => {
    try {
      const res = await this.client.follow(username);

      if ('user1' in res) {
        this.dispatch(a.users.addUser(res.user1));
        this.dispatch(a.users.addUser(res.user2));
      }

      this.dispatch(a.river.clearRiver());
      this.loadPostRiver();
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  unfollowUser = async (username) => {
    try {
      const res = await this.client.unfollow(username);

      if ('user1' in res) {
        this.dispatch(a.users.addUser(res.user1));
        this.dispatch(a.users.addUser(res.user2));
      }

      this.dispatch(a.river.clearRiver());
      this.loadPostRiver();
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  ignoreUser = async (username) => {
    try {
      await this.client.ignoreUser(username);
      const result = await this.client.userSuggestions();

      this.dispatch(a.users.setPersonalizedSuggestedUsers(result));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  login = async (needRedirect, username, password) => {
    this.dispatch(a.messages.removeAllMessages());
    let user;

    try {
      user = (await this.client.login({ username, password })).user;
    } catch (e) {
      // this.dispatch(a.users.setCurrentUser(null));

      if (e.response && ('error' in e.response)) {
        this.dispatch(a.messages.addError(e.response.error));
      } else if (e.status === 401) {
        this.dispatch(a.messages.addError('login.errors.invalid'));
      } else {
        // FIXME: this should be reported to developers instead (use Sentry?)
        console.warn(e);  // eslint-disable-line no-console
        this.dispatch(a.messages.addError('api.errors.internal'));
      }
      return false;
    }

    this.loginUser(needRedirect, user);
    return true;
  };

  loginUser = async (needRedirect, user) => {
    try {
      this.dispatch(a.users.setCurrentUser(user));
      this.dispatch(a.users.setLikes(user.id, user.liked_posts.map(like => like.id)));
      this.dispatch(a.users.setFavourites(user.id, user.favourited_posts.map(fav => fav.id)));

      if (needRedirect) {
        browserHistory.push('/');
      }

      if (user.more) {
        const { lang } = user.more;
        if (!(lang in t.dictionary())) {
          await this.setLocale(lang);
        } else {
          this.dispatch(a.ui.setLocale(lang));
        }
      }

      if (!user.more || user.more.first_login) {
        await this.loadInitialSuggestions();
        this.dispatch(a.messages.addMessage('welcome-first-login'));
      } else {
        await this.loadPersonalizedSuggestions();
        this.dispatch(a.messages.addMessage('welcome-user'));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  resetPassword = async (email) => {
    try {
      await this.client.resetPassword(email);
      this.dispatch(a.users.submitResetPassword());
    } catch (e) {
      this.dispatch(a.messages.addError('Invalid username or password'));
    }
  };

  newPassword = async (hash, password, password_repeat) => {
    try {
      await this.client.newPassword(hash, password, password_repeat);
      this.dispatch(a.users.submitNewPassword());
    } catch (e) {
      if (e.response && ('error' in e.response)) {
        this.dispatch(a.messages.addError(e.response.error));
      } else {
        this.dispatch(a.messages.addError(e.message));
      }
    }
  };

  registerUser = async (attrs) => {
    this.dispatch(a.messages.removeAllMessages());

    // FIXME: disable form
    try {
      const result = await this.client.registerUser(attrs);

      if (result.success) {
        this.dispatch(a.users.registrationSuccess());
      }
    } catch (e) {
      // FIXME: enable form again

      if (e.response && ('error' in e.response)) {
        // FIXME: enable form again
        const errors = e.response.error;
        let message = '';

        for (const fieldName in errors) {
          const es = errors[fieldName];
          if (Array.isArray(es)) {
            es.forEach(msg => message += msg.concat('\n'));
          } else {
            message += es;
          }
        }

        this.dispatch(a.messages.addError(message));
      } else {
        this.dispatch(a.messages.addError('api.errors.internal'));
      }
    }
  };

  setQuotes = async () => {
    try {
      const result = await this.client.getQuotes();

      this.dispatch(a.quotes.setQuotes(result));
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

      const userTags = await this.client.userTags();
      this.dispatch(a.tags.setUserTags(userTags));
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

  loadRecentlyUsedTags = async () => {
    try {
      const result = await this.client.recentlyUsedTags();
      this.dispatch(a.recentTags.setRecentTags(result));
    } catch (e) {
      this.dispatch(a.messages.reportError(a.recentTags.SET_RECENT_TAGS, e.message, { display: true }));
    }
  }

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

  createSchool = async (schoolFields) => {
    let school;
    try {
      school = await this.client.createSchool(schoolFields);
      this.dispatch(a.schools.addSchool(school));
      this.dispatch(a.messages.addMessage('School has been registered successfully'));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      throw e;
    }

    return school;
  }

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

  toolsLoadSchoolsRiver = async (query = {}, triggerUiChanges = true) => {
    if (triggerUiChanges) {
      this.dispatch(a.ui.setProgress('loadingSchoolsRiver', true));
    }

    let result;
    try {
      result = await this.client.schools({ havePosts: true, ...query });
      this.dispatch(a.schools.setSchools(result));

      if (!query.offset) {
        this.dispatch(a.tools.setSchoolsRiver(result));
      } else {
        this.dispatch(a.tools.addSchoolsToRiver(result));
      }

      if (result.length < query.limit) {
        this.dispatch(a.tools.setAllSchoolsLoaded(true));
      } else {
        this.dispatch(a.tools.setAllSchoolsLoaded(false));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }

    this.dispatch(a.ui.setProgress('loadingSchoolsRiver', false));

    return result;
  }

  toolsLoadUserPostsRiver = async (userName, query = {}) => {
    this.dispatch(a.ui.setProgress('loadingUserPostsRiver', true));

    let result;
    try {
      result = await this.client.userPosts(userName, query);

      if (!query.offset) {
        this.dispatch(a.tools.setUserPostsRiver(result));
      } else {
        this.dispatch(a.tools.addUserPostsToRiver(result));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }

    this.dispatch(a.ui.setProgress('loadingUserPostsRiver', false));

    return result;
  };

  loadInitialSuggestions = async () => {
    try {
      const result = await this.client.initialSuggestions();

      this.dispatch(a.users.addUsers(result));
      this.dispatch(a.users.setSuggestedUsers(result));

      return result;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      return false;
    }
  };

  loadPersonalizedSuggestions = async () => {
    try {
      const result = await this.client.userSuggestions();

      this.dispatch(a.users.setPersonalizedSuggestedUsers(result));

      return result;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
      return false;
    }
  };

  loadAllPosts = async (query) => {
    let result;

    this.dispatch(a.ui.setProgress('loadAllPostsInProgress', true));

    try {
      result = await this.client.allPosts(query);

      if (query.offset && query.offset > 0) {
        this.dispatch(a.allPosts.addPosts(result.posts));
      } else {
        this.dispatch(a.allPosts.setPosts(result.posts));
      }
    } catch (e) {
      result = e;
      this.dispatch(a.messages.addError(e.message));
    }

    this.dispatch(a.ui.setProgress('loadAllPostsInProgress', false));

    return result;
  };

  loadMostLikedPosts = async (query) => {
    let result = false;

    this.dispatch(a.ui.setProgress('loadMostLikedPostsInProgress', true));

    try {
      result = await this.client.allPosts({
        ...query,
        sort: '-new_like_count'
      });

      if (query.offset && query.offset > 0) {
        this.dispatch(a.mostLikedPosts.addPosts(result.posts));
      } else {
        this.dispatch(a.mostLikedPosts.setPosts(result.posts));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }

    this.dispatch(a.ui.setProgress('loadMostLikedPostsInProgress', false));

    return result;
  }

  loadMostFavouritedPosts = async (query) => {
    let result = false;

    this.dispatch(a.ui.setProgress('loadMostFavouritedPostsInProgress', true));

    try {
      result = await this.client.allPosts({
        ...query,
        sort: '-new_fav_count'
      });

      if (query.offset && query.offset > 0) {
        this.dispatch(a.mostFavouritedPosts.addPosts(result.posts));
      } else {
        this.dispatch(a.mostFavouritedPosts.setPosts(result.posts));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }

    this.dispatch(a.ui.setProgress('loadMostFavouritedPostsInProgress', false));

    return result;
  }

  loadBestPosts = async (query) => {
    let result;

    this.dispatch(a.ui.setProgress('loadBestPostsInProgress', true));

    try {
      result = await this.client.allPosts({
        ...query,
        sort: '-score'
      });

      if (query.offset && query.offset > 0) {
        this.dispatch(a.bestPosts.addPosts(result.posts));
      } else {
        this.dispatch(a.bestPosts.setPosts(result.posts));
      }
    } catch (e) {
      result = e;
      this.dispatch(a.messages.addError(e.message));
    }

    this.dispatch(a.ui.setProgress('loadBestPostsInProgress', false));

    return result;
  }

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

  loadHashtagSubscriptions = async (query = { offset: 0 }) => {
    this.dispatch(a.ui.setProgress('loadHashtagSubscriptionsRiver'), true);

    let result;

    try {
      result = await this.client.hashtagSubscriptions(query);
      this.dispatch(a.river.loadHashtagSubscriptionsRiver(result));
    } catch (e) {
      this.dispatch(a.messages.reportError(a.river.LOAD_HASHTAG_SUBSCRIPTONS_RIVER, e));
      result = false;
    }

    this.dispatch(a.ui.setProgress('loadHashtagSubscriptionsRiver'), false);

    return result;
  }

  loadSchoolSubscriptions = async (query = { offset: 0 }) => {
    this.dispatch(a.ui.setProgress('loadSchoolSubscriptionsRiver'), true);

    let result;

    try {
      result = await this.client.schoolSubscriptions(query);
      this.dispatch(a.river.loadSchoolSubscriptionsRiver(result));
    } catch (e) {
      this.dispatch(a.messages.reportError(a.river.LOAD_SCHOOL_SUBSCRIPTONS_RIVER, e));
      result = false;
    }

    this.dispatch(a.ui.setProgress('loadSchoolSubscriptionsRiver'), false);

    return result;
  }

  loadGeotagSubscriptions = async (query = { offset: 0 }) => {
    this.dispatch(a.ui.setProgress('loadGeotagSubscriptionsRiver'), true);

    let result;

    try {
      result = await this.client.geotagSubscriptions(query);
      this.dispatch(a.river.loadGeotagSubscriptionsRiver(result));
    } catch (e) {
      this.dispatch(a.messages.reportError(a.river.LOAD_GEOTAG_SUBSCRIPTONS_RIVER, e));
      result = false;
    }

    this.dispatch(a.ui.setProgress('loadGeotagSubscriptionsRiver'), false);

    return result;
  }

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

  addError = (message) => {
    this.dispatch(a.messages.addError(message));
  };

  removeMessage = (id) => {
    this.dispatch(a.messages.removeMessage(id));
  };

  removeAllMessages = () => {
    this.dispatch(a.messages.removeAllMessages());
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

      this.dispatch(a.comments.setPostComments(postId, responseBody));
      this.dispatch(a.comments.createCommentSuccess(postId));
    } catch (e) {
      if (e.response && ('error' in e.response)) {
        this.dispatch(a.comments.createCommentFailure(postId, e.response.error));
      } else {
        this.dispatch(a.messages.addError(e.message));
      }
    }
  };

  deleteComment = async (postId, commentId) => {
    this.dispatch(a.comments.deleteCommentStart(postId, commentId));

    try {
      const responseBody = await this.client.deleteComment(postId, commentId);

      this.dispatch(a.comments.setPostComments(postId, responseBody));
      this.dispatch(a.comments.deleteCommentSuccess(postId, commentId));
    } catch (e) {
      if (e.response && ('error' in e.response)) {
        this.dispatch(a.comments.deleteCommentFailure(postId, commentId, e.response.error));
      } else {
        this.dispatch(a.comments.deleteCommentFailure(postId, commentId, e.message));
      }
    }
  };

  saveComment = async (postId, commentId, text) => {
    this.dispatch(a.comments.saveCommentStart(postId, commentId));

    try {
      const responseBody = await this.client.saveComment(postId, commentId, text);

      this.dispatch(a.comments.setPostComments(postId, responseBody));
      this.dispatch(a.comments.saveCommentSuccess(postId, commentId));
    } catch (e) {
      if (e.response && ('error' in e.response)) {
        this.dispatch(a.comments.deleteCommentFailure(postId, commentId, e.response.error));
      } else {
        this.dispatch(a.comments.saveCommentFailure(postId, commentId, e.message));
      }
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

  search = async (query, more) => {
    try {
      const response = await this.client.search(query);
      this.dispatch(a.search.setSearchResults(response, more));
    } catch (e) {
      this.dispatch(a.search.clearSearchResults(more.searchId));
      this.dispatch(a.messages.addError(e.message));
    }
  }

  subscribeToPost = async (postId) => {
    try {
      await this.client.subscribeToPost(postId);
      this.dispatch(a.users.subscribeToPost(postId));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  }

  unsubscribeFromPost = async (postId) => {
    try {
      await this.client.unsubscribeFromPost(postId);
      this.dispatch(a.users.unsubscribeFromPost(postId));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  }

  sendMessage = async (userId, text) => {
    try {
      const message = await this.client.sendMessage(userId, text);
      this.dispatch(a.userMessages.addUserMessage(userId, message));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  }

  updateUserMessages = async (userId) => {
    try {
      const messages = await this.client.userMessages(userId);
      this.dispatch(a.userMessages.setUserMessages(userId, messages));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  }

  loadUserProfilePosts = async (username, offset = 0, limit = 10) => {
    this.dispatch(a.ui.setProgress('loadProfilePostsInProgress', true));

    let result;
    try {
      result = await this.client.profilePosts(username, offset, limit);
      if (result.length > 0) {
        this.dispatch(a.posts.setProfilePosts(
          result[0].user_id,
          result,
          offset
        ));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }

    this.dispatch(a.ui.setProgress('loadProfilePostsInProgress', false));
    return result;
  }

  createProfilePost = async (attrs) => {
    let success = false;
    try {
      const post = await this.client.createProfilePost(attrs);
      this.dispatch(a.posts.addProfilePost(post));
      success = true;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
    return success;
  }

  updateProfilePost = async (profilePostId, attrs) => {
    let success = false;
    try {
      const post = await this.client.updateProfilePost(profilePostId, attrs);
      this.dispatch(a.posts.updateProfilePost(post));
      success = true;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
    return success;
  }

  removeProfilePost = async (profilePost, user) => {
    const postId = profilePost.get('id');
    const userId = profilePost.get('user_id');
    const postType = profilePost.get('type');

    let success = false;
    try {
      if (postType === 'avatar' || postType === 'head_pic') {
        const userpic = user.getIn(['more', postType], ImmutableMap());
        if (userpic.get('attachment_id') === profilePost.getIn(['more', 'attachment_id'])) {
          const result = await this.client.updateUser({ more: { [postType]: null } });
          if ('user' in result) {
            this.dispatch(a.users.addUser(result.user));
          } else {
            return success;
          }
        }
      }

      const result = await this.client.deleteProfilePost(postId);
      success = result.success;
      if (success) {
        this.dispatch(a.posts.removeProfilePost(postId, userId));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
    return success;
  }

  loadContinentNav = async (continentId) => {
    try {
      const [continents, countries] = await Promise.all([
        this.client.getGeotags({ type: 'Continent', sort: 'url_name' }),
        this.client.getGeotags({
          continent_id: continentId,
          limit: 3,
          sort: '-hierarchy_post_count',
          type: 'Country'
        })
      ]);

      this.dispatch(a.geotags.setContinentNav(continents, countries));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  setLocale = async (_code) => {
    let code = _code;

    if (!code) {
      if (canUseStorage) {
        code = window.localStorage.getItem('locale') || DEFAULT_LOCALE;
      } else {
        code = DEFAULT_LOCALE;
      }
    }

    let success = false;
    try {
      let locale;
      if (process.env.NODE_ENV === 'production') {
        locale = await this.client.getLocale(code);
      } else {
        locale = require(`../../res/locale/${code}.json`); // eslint-disable-line prefer-template
      }

      if (isBrowser) {
        t
          .setLocale(code, locale)
          .currentLocale = code;
        if (canUseStorage) {
          window.localStorage.setItem('locale', code);
        }
      }

      this.dispatch(a.ui.setLocale(code));
      success = true;
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }

    return success;
  };

  loadGeotags = async (query = {}) => {
    try {
      const response = await this.client.getGeotags(query);
      this.dispatch(a.geotags.addGeotags(response));
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };

  loadAllHashtags = async (query = {}) => {
    try {
      // const response = await this.client.getHashtags(query);

      const response = {
        count: 3,
        offset: 0,
        "entries": [
          {
            count: 1,
            entries: [
              {"id":"588b5852-a86b-4551-850f-77bf319cb42f","name":"abc","more":null,"post_count":1,"created_at":"2017-12-17T04:42:01.957Z","updated_at":"2017-12-17T04:42:01.780Z","_sphinx_id":"70"}
            ],
            key: 'first_letter',
            offset: 0,
            value: 'a'
          },
          {
            count: 11,
            entries: [
              {"id":"c001aa67-a275-4086-878a-5cab9515f20b","name":"test3","more":null,"post_count":1,"created_at":"2017-12-18T03:59:51.387Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"72","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"c001aa67-a275-4086-878a-5cab9515f20b"},{"id":"d8c61884-b190-42a4-ae56-22753f897f85","name":"test4","more":null,"post_count":1,"created_at":"2017-12-18T03:59:51.391Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"73","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"d8c61884-b190-42a4-ae56-22753f897f85"},{"id":"23789356-df9c-4091-b582-937b4a2b7451","name":"test5","more":null,"post_count":1,"created_at":"2017-12-18T03:59:51.394Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"74","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"23789356-df9c-4091-b582-937b4a2b7451"},{"id":"f820da73-5239-4f48-846b-2cdbde66a743","name":"test6","more":null,"post_count":1,"created_at":"2017-12-18T03:59:51.404Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"75","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"f820da73-5239-4f48-846b-2cdbde66a743"},{"id":"f7579f5f-991d-40bf-bf03-652d78875ed4","name":"test7","more":null,"post_count":1,"created_at":"2017-12-18T03:59:51.408Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"76","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"f7579f5f-991d-40bf-bf03-652d78875ed4"},{"id":"524aa3f1-24a4-426b-b0aa-273ba843410f","name":"test8","more":null,"post_count":1,"created_at":"2017-12-18T03:59:51.413Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"77","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"524aa3f1-24a4-426b-b0aa-273ba843410f"},{"id":"4ab38ba9-9d2c-4436-993d-2e34cc46256e","name":"test9","more":null,"post_count":1,"created_at":"2017-12-18T03:59:51.417Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"78","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"4ab38ba9-9d2c-4436-993d-2e34cc46256e"},{"id":"60180fd8-e0f6-4c97-99c8-868d95ada0a3","name":"test10","more":null,"post_count":1,"created_at":"2017-12-18T03:59:51.421Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"79","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"60180fd8-e0f6-4c97-99c8-868d95ada0a3"},{"id":"d630a87a-a556-43a5-a77c-f1e592fedcf9","name":"test2","more":null,"post_count":2,"created_at":"2017-12-17T04:41:42.268Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"69","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"d630a87a-a556-43a5-a77c-f1e592fedcf9"},{"id":"66348703-ccb9-4302-9572-3a50155fa5ba","name":"test1","more":null,"post_count":2,"created_at":"2017-12-17T04:41:30.915Z","updated_at":"2017-12-18T03:59:50.935Z","_sphinx_id":"68","_pivot_post_id":"a1ec353e-3891-44ed-b62e-14bcf3ec86a9","_pivot_hashtag_id":"66348703-ccb9-4302-9572-3a50155fa5ba"},
              {"id":"95e724c7-971c-4e69-a1b6-418b49360fa9","name":"test","more":null,"post_count":1,"created_at":"2017-10-20T22:26:53.809Z","updated_at":"2017-10-20T22:26:53.675Z","_sphinx_id":"67"}
            ],
            key: 'first_letter',
            offset: 0,
            value: 't'
          },
          {
            count: 1,
            entries: [
              {"id":"81090db1-84f8-4c73-932c-9d0c94a966c2","name":"xyz","more":null,"post_count":1,"created_at":"2017-12-17T04:42:14.644Z","updated_at":"2017-12-17T04:42:14.494Z","_sphinx_id":"71"}
            ],
            key: 'first_letter',
            offset: 0,
            value: 'x'
          }
        ]
      };

      if (query.group_by) {
        this.dispatch(a.river.loadGroupedTagRiver(
          query,
          response.entries,
          omit(response, ['entries'])
        ));
      } else {
        this.dispatch(a.river.loadFlatTagRiver(
          query,
          response.entries,
          omit(response, ['entries'])
        ));
      }
    } catch (e) {
      this.dispatch(a.messages.addError(e.message));
    }
  };
}
