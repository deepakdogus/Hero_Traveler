import { call, put } from 'redux-saga/effects'
import _ from 'lodash'
import SignupActions from '../Redux/SignupRedux'
import SessionActions from '../Redux/SessionRedux'

// attempts to signup with email
export function * signupEmail (api, action) {
  const {fullName, username, email, password} = action
  const response = yield call(
    api.signupEmail,
    fullName,
    username,
    email,
    password
  )

  if (response.ok) {
    const {user, tokens} = response.data
    const accessToken = _.find(tokens, {type: 'access'})
    yield [
      call(api.setAuth, accessToken.value),
      put(SignupActions.signupEmailSuccess()),
      put(SessionActions.initializeSession(user, tokens))
    ]
  } else {
    yield put(SignupActions.signupEmailFailure(response.data.message))
  }
}
