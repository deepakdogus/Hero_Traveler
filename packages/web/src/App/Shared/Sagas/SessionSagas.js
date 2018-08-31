import { call, put, select } from 'redux-saga/effects'
import _ from 'lodash'
import UserActions from '../Redux/Entities/Users'
import LoginActions from '../Redux/LoginRedux'
import SessionActions from '../Redux/SessionRedux'
import StartupActions from '../Redux/StartupRedux'
import SignupActions from '../Redux/SignupRedux'

const currentUserId = ({session}) => session.userId
const currentUserTokens = ({session}) => session.tokens

// attempts to signup with email
export function * logout (api, action) {
  let setIsLoggedIn = undefined
  const {tokens, deviceType} = action

  const userId = yield select(currentUserId)
  yield call(api.removeDevice, userId)

  let resultAction;
  try {
    yield call(
      api.logout,
      tokens
    )
    resultAction = SessionActions.logoutSuccess;
    setIsLoggedIn = LoginActions.setIsLoggedIn
  } catch(err) {
    resultAction = SessionActions.logoutFailure;
  } finally {
    setIsLoggedIn ? yield[
      put(resultAction(deviceType)),
      put(setIsLoggedIn(false)),
      call(api.unsetAuth),
    ] : yield [
        put(resultAction()),
        call(api.unsetAuth),
      ]
    yield put(StartupActions.hideSplash())
  }
}

export function * resumeSession (api, action) {
  // I believe the userId here is redundant. Added task to remove
  let [userId, tokens]= yield [
    select(currentUserId),
    select(currentUserTokens)
  ]

  // for web we use retrieved tokens (cookies) since store does not persist
  if (action.retrievedTokens) tokens = action.retrievedTokens
  const accessToken = _.find(tokens, {type: 'access'})
  if (!accessToken) return yield put(SessionActions.resumeSessionFailure())

  yield call(api.setAuth, accessToken.value)
  const response = yield call(
    api.getMe,
    userId
  )

  if (response.ok) {
    const {users} = response.data.entities
    if (!userId) userId = Object.keys(users)[0]
    const user = users[userId]
    yield [
      // @TODO test me
      // Must receive users before running session initialization
      // so the user object is accessible
      put(UserActions.receiveUsers({[user.id]: user})),
      put(UserActions.fetchActivities()),
      put(SignupActions.signupGetUsersCategories()),
    ]
    yield put(SessionActions.initializeSession(user.id, tokens))
    yield put(SessionActions.refreshSessionSuccess(tokens))
  } else {
    // simply not logging them out if we have their token info
    // const errorMessage = new Error('You have been logged out.')
    // yield put(SessionActions.resumeSessionFailure(errorMessage))
    // yield put(SessionActions.resetRootStore())
    // yield put(ScreenActions.openScreen('launchScreen'))
    // yield put(StartupActions.hideSplash())
  }
}

// Check current tokens to see if they need to be refreshed
export function * refreshSession(api) {
  const tokens = yield select(currentUserTokens)
  const accessToken = _.find(tokens, {type: 'access'})
  const refreshToken = _.find(tokens, {type: 'refresh'})
  const refreshWindow = 24 * 3600

  if (accessToken.expiresIn > refreshWindow) {
    return yield put(SessionActions.refreshSessionSuccess(tokens))
  }

  const response = yield call(api.refreshTokens, refreshToken.value)

  if (response.ok) {
    const {tokens: newTokens} = response.data
    const newAccessToken = _.find(newTokens, {type: 'access'})
    return yield [
      call(api.setAuth, newAccessToken.value),
      put(SessionActions.refreshSessionSuccess(newTokens))
    ]
  } else {
    return yield put(SessionActions.refreshSessionSuccess(tokens))
  }
}