import _ from 'lodash'
import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import SessionActions from '../Redux/SessionRedux'
import errorFormatter from '../Lib/errorFormatter'

// attempts to login
export function * login (api, { username, password }) {
  try {
    const response = yield call(
      api.login,
      username,
      password
    )

    if (response.ok) {
      const {user, tokens} = response.data
      const accessToken = _.find(tokens, {type: 'access'})
      yield [
        call(api.setAuth, accessToken.value),
        put(SessionActions.initializeSession(user, tokens)),
        put(LoginActions.loginSuccess())
      ]
    } else {
      yield put(LoginActions.loginFailure(errorFormatter(response)))
    }
  } catch (e) {
    yield put(LoginActions.loginFailure(e))
  }
}

export function * loginFacebook () {
  yield put(LoginActions.loginFacebookSuccess())
}

export function * resetPassword (api, {email}) {

  console.log("api.resetPassword: ", api.resetPassword)
  try {
    const response = yield call(
      api.resetPassword,
      email
    )

    if (response.ok) {
      yield put(LoginActions.resetPasswordRequestSuccess())
    } else {
      yield put(LoginActions.resetPasswordRequestFailure(new Error('Reset request failed')))
    }
  } catch (e) {
    yield put(LoginActions.resetPasswordRequestFailure(e))
  }
}







