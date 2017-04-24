import { call, put, select } from 'redux-saga/effects'
import SignupActions from '../Redux/SignupRedux'
import SessionActions from '../Redux/SessionRedux'

const currentUserId = ({session}) => session.userId

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

// attempts to signup with email
export function * getMe (api, action) {
  const {tokens} = action
  const response = yield call(
    api.getMe
  )

  if (response.ok) {
    yield put(SessionActions.refreshUserSuccess(response.data))
  } else {
    yield put(SessionActions.refreshUserFailure())
  }
}

export function * updateUser (api, action) {
  const {attrs} = action
  const userId = yield select(currentUserId)
  const response = yield call(
    api.updateUser,
    userId,
    attrs
  )

  if (response.ok) {
    yield put(SessionActions.updateUserSuccess(response.data))
  } else {
    yield put(SessionActions.updateUserFailure(new Error('Failed to update user')))
  }
}
