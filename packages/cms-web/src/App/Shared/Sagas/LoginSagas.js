import _ from 'lodash'
import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import SessionActions from '../Redux/SessionRedux'
import SignupActions from '../Redux/SignupRedux'
import UserActions from '../Redux/Entities/Users'
import errorFormatter from '../Lib/errorFormatter'

// attempts to login
export function * login (api, { userIdentifier, password }) {
  try {
    const response = yield call(
      api.login,
      userIdentifier,
      password
    )
    if (response.ok) {
      const {user, tokens} = response.data
      const accessToken = _.find(tokens, {type: 'access'})
      yield call(api.setAuth, accessToken.value)
      yield [
        // @TODO test me
        // Must receive users before running session initialization
        // so the user object is accessible
        put(UserActions.receiveUsers({[user.id]: user})),
        call(api.updateDevice, user.id),
        put(SessionActions.initializeSession(user.id, tokens)),
        put(LoginActions.loginSuccess()),
        put(UserActions.fetchActivities()),
        put(SignupActions.signupGetUsersCategories())
      ]
    } else {
      yield put(LoginActions.loginFailure(errorFormatter(response)))
    }
  } catch (error) {
    yield put(LoginActions.loginFailure(error))
  }
}

// attempts to login as admin
export function * loginAdmin (api, { userIdentifier, password }) {
  try {
    const response = yield call(
      api.loginAdmin,
      userIdentifier,
      password
    )

    if (response.ok) {
      const {user, tokens} = response.data
      const accessToken = _.find(tokens, {type: 'access'})
      yield call(api.setAuth, accessToken.value)
      yield [
        // @TODO test me
        // Must receive users before running session initialization
        // so the user object is accessible
        put(UserActions.receiveUsers({[user.id]: user})),
        call(api.updateDevice, user.id),
        put(SessionActions.initializeSession(user.id, tokens)),
        put(LoginActions.loginSuccess()),
        put(UserActions.fetchActivities()),
        put(SignupActions.signupGetUsersCategories()),
      ]
    }
    else {
      yield put(LoginActions.loginFailure(errorFormatter(response)))
    }
  }
  catch (error) {
    yield put(LoginActions.loginFailure(error))
  }
}


export function * loginFacebook () {
  yield put(LoginActions.loginFacebookSuccess())
}

export function * resetPasswordRequest (api, {email}) {
  try {
    const response = yield call(
      api.resetPasswordRequest,
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

export function * resetPassword (api, {token, password}) {
  const response = yield call(
    api.resetPassword,
    token,
    password
  )

  if (response.ok) {
    yield put(LoginActions.resetPasswordSuccess())
  } else {
    yield put(LoginActions.resetPasswordFailure(new Error('Reset password attempt failed')))
  }
}

export function * loggedIn() {
  yield put(LoginActions.setIsLoggedIn(true))
}

export function * verifyEmail (api, {token}) {
  const response = yield call(
    api.verifyEmail,
    token
  )

  if (response.ok) {
    alert('Your email address has been verified')
  } else {
    yield put(LoginActions.verifyEmailFailure(new Error('Reset password attempt failed')))
  }
}

export function * changePassword (api, {userId, oldPassword, newPassword}){
  const response = yield call(
    api.changePassword,
    userId,
    oldPassword,
    newPassword,
  )

  if (response.ok){
    yield put(LoginActions.changePasswordSuccess())
  }else{
    yield put(LoginActions.changePasswordFailure(new Error('Change password attempt failed. Please verify your old password is correct.')))
  }
}
