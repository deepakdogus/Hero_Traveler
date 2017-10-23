import { call, put, select } from 'redux-saga/effects'
import _ from 'lodash'
import UserActions from '../Redux/Entities/Users'
import SessionActions from '../Redux/SessionRedux'
import ScreenActions from '../Redux/OpenScreenRedux'
import StartupActions from '../Redux/StartupRedux'

const currentUserId = ({session}) => session.userId
const currentUserTokens = ({session}) => session.tokens

// attempts to signup with email
export function * logout (api, action) {
  const {tokens} = action

  const userId = yield select(currentUserId)
  yield call(api.removeDevice, userId)

  const response = yield call(
    api.logout,
    tokens
  )

  if (response.ok) {
    yield [
      put(SessionActions.logoutSuccess()),
      call(api.unsetAuth),
    ]
    yield put(StartupActions.hideSplash())
  }
}

// @TODO move me to user sagas
export function * updateUser (api, action) {
  const {attrs} = action
  const userId = yield select(currentUserId)
  const response = yield call(
    api.updateUser,
    userId,
    attrs
  )
  if (response.ok) {
    yield put(UserActions.updateUserSuccess(response.data))
  } else {
    yield put(UserActions.updateUserFailure(new Error('Failed to update user')))
  }
}

export function * resumeSession (api, action) {
  let [userId, tokens]= yield [
    select(currentUserId),
    select(currentUserTokens)
  ]
  // accessToken is set as a cookie for web - part of store on mobile
  const accessTokenValue = action.accessToken || _.find(tokens, {type: 'access'})
  yield call(api.setAuth, accessTokenValue)

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
    ]
    yield put(SessionActions.initializeSession(user.id, tokens))
  } else {
    const errorMessage = new Error('You have been logged out.')
    yield put(SessionActions.resumeSessionFailure(errorMessage))
    yield put(SessionActions.resetRootStore())
    yield put(ScreenActions.openScreen('launchScreen'))
    yield put(StartupActions.hideSplash())
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
      put(SessionActions.refreshSessionSuccess(tokens))
    ]
  } else {
    return yield put(SessionActions.refreshSessionSuccess(tokens))
  }
}
