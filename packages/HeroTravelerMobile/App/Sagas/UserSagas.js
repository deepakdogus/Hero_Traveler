import { call, put } from 'redux-saga/effects'
import UserActions from '../Redux/Entities/Users'

export function * getSuggestedUsers (api, action) {
  const response = yield call(api.getSuggestedUsers)
  if (response.ok) {
    const { entities, result } = response.data;
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
    const { entities } = response.data;
    yield put(UserActions.loadUserSuccess(entities.users[userId]))
  } else {
    yield put(UserActions.loadUserFailure(new Error('Failed to load user')))
  }
}

export function * loadUserFollowers (api, {userId}) {
  const response = yield call(api.getUserFollowers, userId)
  console.log('res', response)
  if (response.ok) {
    const { entities, result } = response.data;
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
    const { entities, result } = response.data;
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
