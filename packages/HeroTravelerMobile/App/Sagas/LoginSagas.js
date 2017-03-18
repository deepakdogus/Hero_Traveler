import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import SessionActions from '../Redux/SessionRedux'
import _ from 'lodash'

// attempts to login
export function * login (api, { username, password }) {
  const response = yield call(
    api.login,
    username,
    password
  )

  console.log('response', response)

  if (response.ok) {
    const {user, tokens} = response.data
    const accessToken = _.find(tokens, {type: 'access'})
    yield [
      call(api.setAuth, accessToken.value),
      put(SessionActions.initializeSession(user, tokens))
    ]
  } else {
    // dispatch failure
    yield put(LoginActions.loginFailure(response.data.message))
  }
}

export function * loginFacebook () {
  yield put(LoginActions.loginFacebookSuccess())
}
