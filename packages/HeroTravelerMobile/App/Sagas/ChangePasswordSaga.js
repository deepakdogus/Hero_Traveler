import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'

export function * changePassword (api, {userId, newPassword}) {
  console.log('changepasswordsaga api', api)
  console.log('changepassword saga userId, newPassword', userId, newPassword)
  try {
    const response = yield call(
      api.changePassword,
      userId,
      newPassword
    )

    if (response.ok) {
      yield put(LoginActions.changePasswordSuccess())
    } else {
      yield put(LoginActions.changePasswordFailure(new Error('Change password attempt failed')))
    }
  } catch (error) {
    yield put(LoginActions.changePasswordFailure(error))
  }
}

