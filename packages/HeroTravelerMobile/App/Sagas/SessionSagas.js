import { call, put, select } from 'redux-saga/effects'
import _ from 'lodash'
import UserActions from '../Redux/Entities/Users'
import SessionActions from '../Redux/SessionRedux'
import StartupActions from '../Redux/StartupRedux'
import ScreenActions from '../Redux/OpenScreenRedux'

const currentUserId = ({session}) => session.userId
const currentUserTokens = ({session}) => session.tokens

// attempts to signup with email
export function * logout (api, action) {
  const {tokens} = action
  const response = yield call(
    api.logout,
    tokens
  )

  if (response.ok) {
    yield [
      put(SessionActions.logoutSuccess()),
      call(api.unsetAuth)
    ]
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

export function * resumeSession (api) {
  const tokens = yield select(currentUserTokens)
  const accessToken = _.find(tokens, {type: 'access'})
  const refreshToken = _.find(tokens, {type: 'refresh'})

  yield call(api.setAuth, accessToken.value)

  const refreshTokenResponse = yield call(
    api.refreshTokens,
    refreshToken.value
  )

  if (refreshTokenResponse.ok) {
    const {user, tokens: newTokens} = refreshTokenResponse.data
    const newAccessToken = _.find(newTokens, {type: 'access'})
    yield [
      // @TODO test me
      // Must receive users before running session initialization
      // so the user object is accessible
      put(UserActions.receiveUsers({[user.id]: user})),
      call(api.setAuth, newAccessToken.value),
      put(SessionActions.initializeSession(user.id, newTokens)),
      // call(ScreenActions.openScreen, 'tabbar'),
      put(ScreenActions.openScreen('tabbar')),
      put(StartupActions.hideSplash()),
    ]
  } else {
    // Remove
    yield put(SessionActions.resetRootStore())
    yield put(SessionActions.resumeSessionError(new Error('Unable to login.')))
  }
}
