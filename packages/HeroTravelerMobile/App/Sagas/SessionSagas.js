import { call, put, select } from 'redux-saga/effects'
import UserActions from '../Redux/Entities/Users'
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
