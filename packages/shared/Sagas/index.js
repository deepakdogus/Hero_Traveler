import { delay } from 'redux-saga'
import { takeLatest, take, fork, race, call, put } from 'redux-saga/effects'

import HeroAPI from '../Services/HeroAPI'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { OpenScreenTypes } from '../Redux/OpenScreenRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { SignupTypes } from '../Redux/SignupRedux'
import SessionActions, { SessionTypes } from '../Redux/SessionRedux'
import { StoryCreateTypes } from '../Redux/StoryCreateRedux'
import { MediaUploadTypes } from '../Redux/MediaUploadRedux'
// Entities
import { StoryTypes } from '../Redux/Entities/Stories'
import { CategoryTypes } from '../Redux/Entities/Categories'
import { UserTypes } from '../Redux/Entities/Users'

/* ------------- Sagas ------------- */

import { startup, heroStartup } from './StartupSagas'
import {
  login,
  loginFacebook,
  resetPasswordRequest,
  resetPassword,
  loggedIn,
  verifyEmail
} from './LoginSagas'
import {
  signupEmail,
  signupFacebook,
  getUsersCategories,
  followCategory,
  unfollowCategory,
  followUser,
  unfollowUser,
} from './SignupSagas'
import {
  logout,
  updateUser,
  resumeSession,
  refreshSession
} from './SessionSagas'
// related to nav which is device specific so not located in shared folder
import { openScreen } from '../../Sagas/OpenScreenSagas'

import { getCategories } from './CategorySagas'
import {
  getSuggestedUsers,
  loadUser,
  loadUserFollowing,
  loadUserFollowers, userFollowUser, userUnfollowUser, getActivities, seenActivity
} from './UserSagas'

import {
  getStory,
  getUserFeed,
  registerDraft,
  publishDraft,
  discardDraft,
  updateDraft,
  getUserStories,
  getCategoryStories,
  likeStory,
  bookmarkStory,
  getBookmarks,
  uploadCoverImage, loadStory, loadDrafts, deleteStory,
  flagStory,
} from './StorySagas'

import {
  uploadMedia,
} from './MediaUploadSagas'

/* ------------- API ------------- */

const heroAPI = HeroAPI.create()

/* ------------- Connect Types To Sagas ------------- */

// function delay(millis) {
//   const promise = new Promise(resolve => {
//     setTimeout(() => resolve(true), millis)
//   });
//   return promise;
// }

function * pollRefreshTokens() {
  yield call(delay, 60 * 1000)
  yield put(SessionActions.refreshSession())
}

function * watchRefreshTokens() {
  while(true) { // eslint-disable-line no-constant-condition
    yield take([
      SessionTypes.INITIALIZE_SESSION,
      SessionTypes.REFRESH_SESSION_SUCCESS
    ])
    yield race([
      call(pollRefreshTokens),
      take(SessionTypes.LOGOUT_SUCCESS)
    ])
  }
}

export default function * root () {
  yield [
    fork(watchRefreshTokens),
    takeLatest(StartupTypes.STARTUP, startup, heroAPI),
    takeLatest(StartupTypes.HERO_STARTUP, heroStartup, heroAPI),
    takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),
    takeLatest(LoginTypes.LOGIN_REQUEST, login, heroAPI),
    takeLatest(LoginTypes.LOGIN_FACEBOOK, loginFacebook),
    takeLatest(LoginTypes.RESET_PASSWORD_REQUEST, resetPasswordRequest, heroAPI),
    takeLatest(LoginTypes.RESET_PASSWORD, resetPassword, heroAPI),
    takeLatest(LoginTypes.VERIFY_EMAIL, verifyEmail, heroAPI),
    takeLatest(SessionTypes.INITIALIZE_SESSION, loggedIn),

    takeLatest(SignupTypes.SIGNUP_EMAIL, signupEmail, heroAPI),
    takeLatest(SignupTypes.SIGNUP_FACEBOOK, signupFacebook, heroAPI),
    takeLatest(SignupTypes.SIGNUP_GET_USERS_CATEGORIES, getUsersCategories, heroAPI),
    takeLatest(SignupTypes.SIGNUP_FOLLOW_CATEGORY, followCategory, heroAPI),
    takeLatest(SignupTypes.SIGNUP_UNFOLLOW_CATEGORY, unfollowCategory, heroAPI),
    takeLatest(SignupTypes.SIGNUP_FOLLOW_USER, followUser, heroAPI),
    takeLatest(SignupTypes.SIGNUP_UNFOLLOW_USER, unfollowUser, heroAPI),
    takeLatest(SessionTypes.LOGOUT, logout, heroAPI),
    takeLatest(SessionTypes.RESUME_SESSION, resumeSession, heroAPI),
    takeLatest(SessionTypes.REFRESH_SESSION, refreshSession, heroAPI),

    // Drafts and story creation
    takeLatest(StoryCreateTypes.PUBLISH_DRAFT, publishDraft, heroAPI),
    takeLatest(StoryCreateTypes.REGISTER_DRAFT, registerDraft, heroAPI),
    takeLatest(StoryCreateTypes.DISCARD_DRAFT, discardDraft, heroAPI),
    takeLatest(StoryCreateTypes.UPDATE_DRAFT, updateDraft, heroAPI),
    takeLatest(StoryCreateTypes.UPLOAD_COVER_IMAGE, uploadCoverImage, heroAPI),
    takeLatest(StoryCreateTypes.EDIT_STORY, loadStory, heroAPI),

    takeLatest(StoryTypes.STORY_REQUEST, getStory, heroAPI),
    takeLatest(StoryTypes.FEED_REQUEST, getUserFeed, heroAPI),
    takeLatest(StoryTypes.FROM_USER_REQUEST, getUserStories, heroAPI),
    takeLatest(StoryTypes.FROM_CATEGORY_REQUEST, getCategoryStories, heroAPI),
    takeLatest(StoryTypes.STORY_LIKE, likeStory, heroAPI),
    takeLatest(StoryTypes.STORY_BOOKMARK, bookmarkStory, heroAPI),
    takeLatest(CategoryTypes.LOAD_CATEGORIES_REQUEST, getCategories, heroAPI),
    takeLatest(StoryTypes.LOAD_DRAFTS, loadDrafts, heroAPI),
    takeLatest(StoryTypes.DELETE_STORY, deleteStory, heroAPI),
    takeLatest(StoryTypes.GET_BOOKMARKS, getBookmarks, heroAPI),
    takeLatest(StoryTypes.FLAG_STORY, flagStory, heroAPI),

    // Users
    takeLatest(UserTypes.LOAD_USER_SUGGESTIONS_REQUEST, getSuggestedUsers, heroAPI),
    takeLatest(UserTypes.LOAD_USER, loadUser, heroAPI),
    takeLatest(UserTypes.UPDATE_USER, updateUser, heroAPI),
    takeLatest(UserTypes.LOAD_USER_FOLLOWING, loadUserFollowing, heroAPI),
    takeLatest(UserTypes.LOAD_USER_FOLLOWERS, loadUserFollowers, heroAPI),
    takeLatest(UserTypes.FOLLOW_USER, userFollowUser, heroAPI),
    takeLatest(UserTypes.UNFOLLOW_USER, userUnfollowUser, heroAPI),
    takeLatest(UserTypes.FETCH_ACTIVITIES, getActivities, heroAPI),
    takeLatest(UserTypes.ACTIVITY_SEEN, seenActivity, heroAPI),

    // Media Upload
    takeLatest(MediaUploadTypes.UPLOAD_REQUEST, uploadMedia, heroAPI)
  ]
}
