import _ from 'lodash'
import { call, put, select } from 'redux-saga/effects'
import UserActions from '../Redux/Entities/Users'
import StoryActions from '../Redux/Entities/Stories'
import StartupActions from '../Redux/StartupRedux'
import SessionActions from '../Redux/SessionRedux'
import SignupActions from '../Redux/SignupRedux'
import { loginToFacebookAndGetUserInfo } from '../../Services/FacebookConnect'

const currentUserId = ({session}) => session.userId

export function * updateUser (api, action) {
  const {attrs} = action
  const userId = yield select(currentUserId)
  if (attrs.introTooltips) {
    yield put(UserActions.eagerUpdateTooltips(userId, attrs.introTooltips))
  }
  const response = yield call(
    api.updateUser,
    userId,
    attrs
  )
  if (response.ok) {
    yield put(UserActions.updateUserSuccess(response.data))
  } else {
    yield put(UserActions.updateUserFailure(new Error(
      _.get(response, "data.message", "Failed to update user")
    )))
  }
}

export function * connectFacebook (api) {
  let userResponse
  try {
    userResponse = yield loginToFacebookAndGetUserInfo()
  } catch(err) {
    console.log('Facebook connect failed with error: ', err)
    yield put(SignupActions.signupFacebookFailure(err))
    return
  }

  if (!userResponse) {
    yield put(SignupActions.signupFacebookFailure())
    return
  }

  try {
    const response = yield call(
      api.connectFacebook,
      userResponse.id,
      userResponse.email
    )
    if (response.ok) {
      yield put(UserActions.connectFacebookSuccess(response.data))
    } else {
      yield put(UserActions.connectFacebookFailure(
        new Error(
          _.get(response, "data.message", "Unknown Error")
        )
      ))
    }
  } catch (error) {
    yield put(UserActions.connectFacebookFailure(
      new Error("There was a network error")
    ))
  }
}

export function * deleteUser(api) {
  try {
    const userId = yield select(currentUserId)
    const response = yield call(
      api.deleteUser,
      userId
    )
    if (response.ok) {
      yield [
        put(UserActions.deleteUserSuccess()),
        put(SessionActions.logoutSuccess()),
        call(api.unsetAuth),
      ]
      yield put(StartupActions.hideSplash())
    } else {
      yield put(UserActions.deleteUserFailure(
        new Error(
          (response.data && response.data.message) ? response.data.message : "Unknown Error")
        )
      )
    }
  } catch(err) {
    yield put(UserActions.deleteUserFailure(
      new Error("There was an error deleting the user.")
    ))
  }
}

export function * getSuggestedUsers (api, action) {
  const response = yield call(api.getSuggestedUsers)
  if (response.ok) {
    const { entities, result } = response.data
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(UserActions.loadUserSuggestionsSuccess(result))
    ]
  } else {
    yield put(UserActions.loadUserSuggestionsFailure(new Error('error loading user suggestions')))
  }
}

export function * loadUser (api, {userId}) {
  const response = yield call(api.getUser, userId)
  if (response.ok) {
    const { entities } = response.data
    yield put(UserActions.receiveUsers(entities.users))
    yield put(UserActions.loadUserSuccess())
  } else {
    yield put(UserActions.loadUserFailure(new Error('Failed to load user')))
  }
}

export function * loadUserFollowers (api, {userId}) {
  const response = yield call(api.getUserFollowers, userId)
  if (response.ok) {
    const { entities, result } = response.data
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(UserActions.loadUserFollowersSuccess(userId, result))
    ]
  } else {
    yield put(UserActions.loadUserFollowersFailure(userId, new Error('Failed to load followers')))
  }
}

export function * loadUserFollowing (api, {userId}) {
  const response = yield call(api.getUserFollowing, userId)
  if (response.ok) {
    const { entities, result } = response.data
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(UserActions.loadUserFollowingSuccess(userId, result))
    ]
  } else {
    yield put(UserActions.loadUserFollowingFailure(userId, new Error('Failed to load follower suggestions')))
  }
}

export function * userFollowUser(api, {userId, targetUserId}) {
  const response = yield call(
    api.followUser,
    targetUserId
  )

  yield put(UserActions.followUserSuccess(userId, targetUserId))

  if (!response.ok) {
    yield put(UserActions.followUserFailure(userId, targetUserId))
  }
}

export function * userUnfollowUser(api, {userId, targetUserId}) {
  const response = yield call(
    api.unfollowUser,
    targetUserId
  )

  yield put(UserActions.unfollowUserSuccess(userId, targetUserId))

  if (!response.ok) {
    yield put(UserActions.unfollowUserFailure(userId, targetUserId))
  }
}

export function  * getActivities(api) {
  const response = yield call(
    api.getActivity
  )

  if (response.ok) {
    const {entities, result} = response.data
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(UserActions.receiveActivities(entities.activities)),
      put(StoryActions.receiveStories(entities.stories)),
    ]
    yield put(UserActions.fetchActivitiesSuccess(result))
  } else {
    yield put(UserActions.fetchActivitiesFailure(new Error('Failed to fetch activities')))
  }
}

export function * seenActivity(api, {activityId}) {
  const response = yield call(
    api.setActivityRead,
    activityId
  )

  if (!response.ok) {
    yield put(UserActions.activitySeenFailure(new Error('Something went wrong'), activityId))
  }
}

export function * removeAvatar(api, {userId}) {
  const response = yield call(
    api.removeAvatarImage,
    userId,
  )
  if (response.ok) {
    yield put(UserActions.removeAvatarSuccess(response.data))
  }
  else {
    yield put(UserActions.removeAvatarFailure(new Error(
      _.get(response, 'data.message', 'Failed to update user')
    )))
  }
}