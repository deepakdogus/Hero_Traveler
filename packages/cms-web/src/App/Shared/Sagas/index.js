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
import { AdminTypes } from '../Redux/AdminRedux'
// Entities
import { StoryTypes } from '../Redux/Entities/Stories'
import { CategoryTypes } from '../Redux/Entities/Categories'
import { HashtagTypes } from '../Redux/Entities/Hashtags'
import { UserTypes } from '../Redux/Entities/Users'
import { GuideTypes } from '../Redux/Entities/Guides'
import { CommentTypes } from '../Redux/Entities/Comments'

/* ------------- Sagas ------------- */

import { startup, heroStartup } from './StartupSagas'
import {
  loginAdmin,
  login,
  loginFacebook,
  resetPasswordRequest,
  resetPassword,
  loggedIn,
  verifyEmail,
  changePassword,
} from './LoginSagas'
import {
  signupEmail,
  signupFacebook,
  getUsersCategories,
  followCategory,
  unfollowCategory,
} from './SignupSagas'
import {
  logout,
  resumeSession,
  refreshSession
} from './SessionSagas'
// related to nav which is device specific so not located in shared folder
import { openScreen } from '../../Sagas/OpenScreenSagas'

import { getCategories } from './CategorySagas'
import { getHashtags } from './HashtagSagas'
import {
  updateUser,
  removeAvatar,
  connectFacebook,
  deleteUser,
  getSuggestedUsers,
  loadUser,
  loadUserFollowing,
  loadUserFollowers,
  userFollowUser,
  userUnfollowUser,
  getActivities,
  seenActivity,
} from './UserSagas'

import {
  getStory,
  getUserFeed,
  getLikesAndBookmarks,
  registerDraft,
  publishLocalDraft,
  publishDraft,
  discardDraft,
  updateDraft,
  getUserStories,
  getCategoryStories,
  likeStory,
  bookmarkStory,
  getBookmarks,
  uploadCoverImage,
  loadStory,
  loadDrafts,
  deleteStory,
  flagStory,
  getGuideStories,
  uploadImage,
} from './StorySagas'

import {
  uploadMedia,
} from './MediaUploadSagas'

import {
  createGuide,
  getGuide,
  updateGuide,
  deleteGuide,
  getUserGuides,
  getUserFeedGuides,
  getCategoryGuides,
  bulkSaveStoryToGuide,
  likeGuide,
  unlikeGuide,
} from './GuideSagas'

import {
  getComments,
  createComment
} from './CommentsSagas'

import {
  adminGetUsers,
  adminGetUser,
  adminGetCategories,
  adminGetStories,
  adminGetGuides
} from './AdminSagas'


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
  yield call(delay, 60 * 60 * 1000) // 1h delay
  yield put(SessionActions.refreshSession())
}

function * watchRefreshTokens() {
  while(true) { // eslint-disable-line no-constant-condition
    yield take([
      SessionTypes.INITIALIZE_SESSION,
      SessionTypes.REFRESH_SESSION_SUCCESS,
    ])
    yield race([
      call(pollRefreshTokens),
      take(SessionTypes.LOGOUT_SUCCESS),
    ])
  }
}


export default function * root () {
  yield [
    fork(watchRefreshTokens),
    takeLatest(StartupTypes.STARTUP, startup, heroAPI),
    takeLatest(StartupTypes.HERO_STARTUP, heroStartup, heroAPI),
    takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),
    takeLatest(LoginTypes.LOGIN_ADMIN_REQUEST, loginAdmin, heroAPI),
    takeLatest(LoginTypes.LOGIN_REQUEST, login, heroAPI),
    takeLatest(LoginTypes.LOGIN_FACEBOOK, loginFacebook),
    takeLatest(LoginTypes.RESET_PASSWORD_REQUEST, resetPasswordRequest, heroAPI),
    takeLatest(LoginTypes.RESET_PASSWORD, resetPassword, heroAPI),
    takeLatest(LoginTypes.VERIFY_EMAIL, verifyEmail, heroAPI),
    takeLatest(LoginTypes.CHANGE_PASSWORD_REQUEST, changePassword, heroAPI),
    takeLatest(SessionTypes.INITIALIZE_SESSION, loggedIn),

    takeLatest(SignupTypes.SIGNUP_EMAIL, signupEmail, heroAPI),
    takeLatest(SignupTypes.SIGNUP_FACEBOOK, signupFacebook, heroAPI),
    takeLatest(SignupTypes.SIGNUP_GET_USERS_CATEGORIES, getUsersCategories, heroAPI),
    takeLatest(SignupTypes.SIGNUP_FOLLOW_CATEGORY, followCategory, heroAPI),
    takeLatest(SignupTypes.SIGNUP_UNFOLLOW_CATEGORY, unfollowCategory, heroAPI),
    takeLatest(SessionTypes.LOGOUT, logout, heroAPI),
    takeLatest(SessionTypes.RESUME_SESSION, resumeSession, heroAPI),
    takeLatest(SessionTypes.REFRESH_SESSION, refreshSession, heroAPI),

    // Drafts and story creation
    takeLatest(StoryCreateTypes.PUBLISH_LOCAL_DRAFT, publishLocalDraft, heroAPI),
    takeLatest(StoryCreateTypes.PUBLISH_DRAFT, publishDraft, heroAPI),
    takeLatest(StoryCreateTypes.REGISTER_DRAFT, registerDraft, heroAPI),
    takeLatest(StoryCreateTypes.DISCARD_DRAFT, discardDraft, heroAPI),
    takeLatest(StoryCreateTypes.UPDATE_DRAFT, updateDraft, heroAPI),
    takeLatest(StoryCreateTypes.UPLOAD_COVER_IMAGE, uploadCoverImage, heroAPI),
    takeLatest(StoryCreateTypes.EDIT_STORY, loadStory, heroAPI),
    takeLatest(StoryCreateTypes.UPLOAD_IMAGE, uploadImage, heroAPI),

    takeLatest(StoryTypes.STORY_REQUEST, getStory, heroAPI),
    takeLatest(StoryTypes.FEED_REQUEST, getUserFeed, heroAPI),
    takeLatest(StoryTypes.LIKES_AND_BOOKMARKS_REQUEST, getLikesAndBookmarks, heroAPI),
    takeLatest(StoryTypes.FROM_USER_REQUEST, getUserStories, heroAPI),
    takeLatest(StoryTypes.FROM_CATEGORY_REQUEST, getCategoryStories, heroAPI),
    takeLatest(StoryTypes.STORY_LIKE, likeStory, heroAPI),
    takeLatest(StoryTypes.STORY_BOOKMARK, bookmarkStory, heroAPI),
    takeLatest(CategoryTypes.LOAD_CATEGORIES_REQUEST, getCategories, heroAPI),
    takeLatest(HashtagTypes.LOAD_HASHTAGS_REQUEST, getHashtags, heroAPI),
    takeLatest(StoryTypes.LOAD_DRAFTS, loadDrafts, heroAPI),
    takeLatest(StoryTypes.GET_GUIDE_STORIES, getGuideStories, heroAPI),
    takeLatest(StoryTypes.DELETE_STORY, deleteStory, heroAPI),
    takeLatest(StoryTypes.GET_BOOKMARKS, getBookmarks, heroAPI),
    takeLatest(StoryTypes.FLAG_STORY, flagStory, heroAPI),

    // Users
    takeLatest(UserTypes.LOAD_USER_SUGGESTIONS_REQUEST, getSuggestedUsers, heroAPI),
    takeLatest(UserTypes.LOAD_USER, loadUser, heroAPI),
    takeLatest(UserTypes.UPDATE_USER, updateUser, heroAPI),
    takeLatest(UserTypes.REMOVE_AVATAR, removeAvatar, heroAPI),
    takeLatest(UserTypes.CONNECT_FACEBOOK, connectFacebook, heroAPI),
    takeLatest(UserTypes.DELETE_USER, deleteUser, heroAPI),
    takeLatest(UserTypes.LOAD_USER_FOLLOWING, loadUserFollowing, heroAPI),
    takeLatest(UserTypes.LOAD_USER_FOLLOWERS, loadUserFollowers, heroAPI),
    takeLatest(UserTypes.FOLLOW_USER, userFollowUser, heroAPI),
    takeLatest(UserTypes.UNFOLLOW_USER, userUnfollowUser, heroAPI),
    takeLatest(UserTypes.FETCH_ACTIVITIES, getActivities, heroAPI),
    takeLatest(UserTypes.ACTIVITY_SEEN, seenActivity, heroAPI),

    // Media Upload
    takeLatest(MediaUploadTypes.UPLOAD_REQUEST, uploadMedia, heroAPI),

    // Guides
    takeLatest(GuideTypes.CREATE_GUIDE, createGuide, heroAPI),
    takeLatest(GuideTypes.GET_GUIDE_REQUEST, getGuide, heroAPI),
    takeLatest(GuideTypes.UPDATE_GUIDE, updateGuide, heroAPI),
    takeLatest(GuideTypes.DELETE_GUIDE_REQUEST, deleteGuide, heroAPI),
    takeLatest(GuideTypes.GET_USER_GUIDES, getUserGuides, heroAPI),
    takeLatest(GuideTypes.GUIDE_FEED_REQUEST, getUserFeedGuides, heroAPI),
    takeLatest(GuideTypes.GET_CATEGORY_GUIDES, getCategoryGuides, heroAPI),
    takeLatest(GuideTypes.BULK_SAVE_STORY_TO_GUIDE_REQUEST, bulkSaveStoryToGuide, heroAPI),
    takeLatest(GuideTypes.LIKE_GUIDE_REQUEST, likeGuide, heroAPI),
    takeLatest(GuideTypes.UNLIKE_GUIDE_REQUEST, unlikeGuide, heroAPI),

    //Comments
    takeLatest(CommentTypes.GET_COMMENTS_REQUEST, getComments, heroAPI),
    takeLatest(CommentTypes.CREATE_COMMENT_REQUEST, createComment, heroAPI),

    //Admin
    takeLatest(AdminTypes.ADMIN_GET_USERS, adminGetUsers, heroAPI),
    takeLatest(AdminTypes.ADMIN_GET_USER, adminGetUser, heroAPI),
    takeLatest(AdminTypes.ADMIN_GET_CATEGORIES, adminGetCategories, heroAPI),
    takeLatest(AdminTypes.ADMIN_GET_STORIES, adminGetStories, heroAPI),
    takeLatest(AdminTypes.ADMIN_GET_GUIDES, adminGetGuides, heroAPI),
  ]
}
