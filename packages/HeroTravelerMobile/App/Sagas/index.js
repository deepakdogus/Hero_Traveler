import { takeLatest } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

import HeroAPI from '../Services/HeroAPI'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { OpenScreenTypes } from '../Redux/OpenScreenRedux'
import { SignupTypes } from '../Redux/SignupRedux'
import { SessionTypes } from '../Redux/SessionRedux'
import { StoryTypes } from '../Redux/StoryRedux'
import { StoryCreateTypes } from '../Redux/StoryCreateRedux'
import { CategoryTypes } from '../Redux/CategoryRedux'
import { UserTypes } from '../Redux/UserRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login, loginFacebook } from './LoginSagas'
import { signupEmail, followCategory, unfollowCategory, followUser, unfollowUser } from './SignupSagas'
import { logout, getMe } from './SessionSagas'
import { getUserAvatar } from './GithubSagas'
import { openScreen } from './OpenScreenSagas'
import { getCategories } from './CategorySagas'
import { getSuggestedUsers } from './UserSagas'

import {
  getUserFeed,
  createPhotoStory,
  getUserStories
} from './StorySagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

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

    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),

    takeLatest(StoryCreateTypes.PUBLISH_REQUEST, createPhotoStory, heroAPI),
    takeLatest(StoryTypes.FEED_REQUEST, getUserFeed, heroAPI),
    takeLatest(StoryTypes.FROM_USER_REQUEST, getUserStories, heroAPI),
    takeLatest(CategoryTypes.LOAD_CATEGORIES_REQUEST, getCategories, heroAPI),
    takeLatest(UserTypes.LOAD_USER_SUGGESTIONS_REQUEST, getSuggestedUsers, heroAPI),
  ]
}
