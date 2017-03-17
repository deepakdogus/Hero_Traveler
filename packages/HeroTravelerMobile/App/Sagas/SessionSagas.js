import { call, put } from 'redux-saga/effects'
import SignupActions from '../Redux/SignupRedux'
import SessionActions from '../Redux/SessionRedux'

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
