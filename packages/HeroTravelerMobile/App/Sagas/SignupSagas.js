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

export function * followCategory(api, {categoryId}) {
  const response = yield call(
    api.followCategory,
    categoryId
  )

  if (response.ok) {
    yield [
      put(SignupActions.signupFollowCategorySuccess(categoryId))
    ]
  } else {
    yield put(SignupActions.signupFollowCategoryFailure(categoryId, 'Did not save'))
  }
}

export function * unfollowCategory(api, {categoryId}) {
  const response = yield call(
    api.unfollowCategory,
    categoryId
  )

  if (response.ok) {
    yield [
      put(SignupActions.signupUnfollowCategorySuccess(categoryId))
    ]
  } else {
    yield put(SignupActions.signupUnfollowCategoryFailure(categoryId, 'Did not save'))
  }
}

export function * followUser(api, {userId}) {
  const response = yield call(
    api.followUser,
    userId
  )

  if (response.ok) {
    yield [
      put(SignupActions.signupFollowUserSuccess(userId))
    ]
  } else {
    yield put(SignupActions.signupFollowUserFailure(userId, 'Did not save'))
  }
}

export function * unfollowUser(api, {userId}) {
  const response = yield call(
    api.unfollowUser,
    userId
  )

  if (response.ok) {
    yield [
      put(SignupActions.signupUnfollowUserSuccess(userId))
    ]
  } else {
    yield put(SignupActions.signupUnfollowUserFailure(userId, 'Did not save'))
  }
}
