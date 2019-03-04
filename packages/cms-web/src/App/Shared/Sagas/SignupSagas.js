import { call, put } from 'redux-saga/effects'
import _ from 'lodash'
import SignupActions from '../Redux/SignupRedux'
import OpenScreenActions from '../Redux/OpenScreenRedux'
import SessionActions from '../Redux/SessionRedux'
import UserActions from '../Redux/Entities/Users'
import {
  loginToFacebookAndGetUserInfo,
} from '../Services/FacebookConnect'

// attempts to signup with email
export function * signupEmail (api, action) {
  try {
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
        put(UserActions.receiveUsers({[user.id]: user})),
        call(api.setAuth, accessToken.value),
        put(SessionActions.initializeSession(user.id, tokens)),
        put(SignupActions.signupEmailSuccess()),
      ]
    } else {
      if (response.data) {
        yield put(SignupActions.signupEmailFailure(response.data.message))
      }
      else {
        yield put(SignupActions.signupEmailFailure(response.problem))
      }
    }
  } catch (err) {
    yield put(SignupActions.signupEmailFailure(err))
  }
}

export function * signupFacebook(api, action) {
  let userResponse
  try {
    userResponse = yield loginToFacebookAndGetUserInfo()
  } catch (err) {
    console.log('Facebook connect failed with error: ', err)
    yield put(SignupActions.signupFacebookFailure())
    return
  }

  if (!userResponse) {
    yield put(SignupActions.signupFacebookFailure())
    return
  }

  const userPicture = !userResponse.picture.data.is_silhouette ?
  userResponse.picture.data.url : null

  const response = yield call(
    api.signupFacebook,
    userResponse.id,
    userResponse.email,
    userResponse.name,
    userPicture
  )

  if (response.ok) {
    const {user, tokens, wasSignedUp } = response.data
    const accessToken = _.find(tokens, {type: 'access'})
    yield call(api.setAuth, accessToken.value)
    yield [
      put(UserActions.receiveUsers({[user.id]: user})),
      put(SessionActions.initializeSession(user.id, tokens))
    ]
    // wasSignedUp = user had previously signed up before this signup attempt
    if (wasSignedUp) {
      yield put(OpenScreenActions.openScreen('tabbar'))
    } else {
      yield put(OpenScreenActions.openScreen('signupFlow'))
      yield put(SignupActions.signupFacebookSuccess())
    }
  } else {
    yield put(SignupActions.signupFacebookFailure(response.data.message))
  }
}

export function * getUsersCategories(api) {
  const response = yield call(
    api.getUsersCategories
  )

  if (response.ok) {
    const categoryIds = response.data.map(category => category.followee)
    yield [
      put(SignupActions.signupGetUsersCategoriesSuccess(categoryIds))
    ]
  } else {
    // add error handler
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
