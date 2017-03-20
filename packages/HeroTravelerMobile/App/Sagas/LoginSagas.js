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
        put(SessionActions.initializeSession(user, tokens))
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
