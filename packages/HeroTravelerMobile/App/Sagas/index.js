import { takeLatest } from 'redux-saga/effects'

import HeroAPI from '../Services/HeroAPI'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { OpenScreenTypes } from '../Redux/OpenScreenRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { SignupTypes } from '../Redux/SignupRedux'
import { SessionTypes } from '../Redux/SessionRedux'
import { StoryCreateTypes } from '../Redux/StoryCreateRedux'
// Entities
import { StoryTypes } from '../Redux/Entities/Stories'
import { CategoryTypes } from '../Redux/Entities/Categories'
import { UserTypes } from '../Redux/Entities/Users'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login, loginFacebook } from './LoginSagas'
import {
  signupEmail,
  followCategory,
  unfollowCategory,
  followUser,
  unfollowUser
} from './SignupSagas'
import { logout, getMe } from './SessionSagas'
import { openScreen } from './OpenScreenSagas'
import { getCategories } from './CategorySagas'
import { getSuggestedUsers } from './UserSagas'

import {
  getUserFeed,
  createPhotoStory,
  getUserStories,
  likeStory,
  bookmarkStory
} from './StorySagas'

/* ------------- API ------------- */

const heroAPI = HeroAPI.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),
    takeLatest(LoginTypes.LOGIN_REQUEST, login, heroAPI),
    takeLatest(LoginTypes.LOGIN_FACEBOOK, loginFacebook),

    takeLatest(SignupTypes.SIGNUP_EMAIL, signupEmail, heroAPI),
    takeLatest(SignupTypes.SIGNUP_FOLLOW_CATEGORY, followCategory, heroAPI),
    takeLatest(SignupTypes.SIGNUP_UNFOLLOW_CATEGORY, unfollowCategory, heroAPI),
    takeLatest(SignupTypes.SIGNUP_FOLLOW_USER, followUser, heroAPI),
    takeLatest(SignupTypes.SIGNUP_UNFOLLOW_USER, unfollowUser, heroAPI),
    takeLatest(SessionTypes.REFRESH_USER, getMe, heroAPI),
    takeLatest(SessionTypes.LOGOUT, logout, heroAPI),

    takeLatest(StoryCreateTypes.PUBLISH_REQUEST, createPhotoStory, heroAPI),
    takeLatest(StoryTypes.FEED_REQUEST, getUserFeed, heroAPI),
    takeLatest(StoryTypes.FROM_USER_REQUEST, getUserStories, heroAPI),
    takeLatest(StoryTypes.STORY_LIKE, likeStory, heroAPI),
    takeLatest(StoryTypes.STORY_BOOKMARK, bookmarkStory, heroAPI),
    takeLatest(CategoryTypes.LOAD_CATEGORIES_REQUEST, getCategories, heroAPI),
    takeLatest(UserTypes.LOAD_USER_SUGGESTIONS_REQUEST, getSuggestedUsers, heroAPI),
  ]
}
