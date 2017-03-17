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

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login, loginFacebook } from './LoginSagas'
import { signupEmail } from './SignupSagas'
import { logout } from './SessionSagas'
import { getUserAvatar } from './GithubSagas'
import { openScreen } from './OpenScreenSagas'


import { getUserFeed } from './StorySagas'

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
    takeLatest(SessionTypes.LOGOUT, logout, heroAPI),

    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),

    takeLatest(StoryTypes.FEED_REQUEST, getUserFeed, heroAPI)
  ]
}
