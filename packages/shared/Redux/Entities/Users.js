import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {fetching, fetchingError, fetchingSuccess} from '../helpers/fetchStatus'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadUser: ['userId'],
  loadUserSuccess: ['user'],
  loadUserFailure: ['error'],
  loadUserFollowers: ['userId'],
  loadUserFollowersSuccess: ['userId', 'usersById'],
  loadUserFollowersFailure: ['userId', 'error'],
  loadUserFollowing: ['userId'],
  loadUserFollowingSuccess: ['userId', 'usersById'],
  loadUserFollowingFailure: ['userId', 'error'],
  loadUserSuggestionsRequest: null,
  loadUserSuggestionsSuccess: ['usersById'],
  loadUserSuggestionsFailure: ['error'],
  followUser: ['userId', 'targetUserId'],
  followUserSuccess: ['userId', 'targetUserId'],
  followUserFailure: ['userId', 'targetUserId'],
  unfollowUser: ['userId', 'targetUserId'],
  unfollowUserSuccess: ['userId', 'targetUserId'],
  unfollowUserFailure: ['userId', 'targetUserId'],
  updateUser: ['attrs'],
  updateUserSuccess: ['user'],
  updateUserFailure: ['error'],
  receiveUsers: ['users'],
  receiveLikes: ['userId', 'storyIds'],
  receiveBookmarks: ['userId', 'storyIds'],
  userToggleLike: ['userId', 'storyId'],
  userToggleBookmark: ['userId', 'storyId'],
  fetchActivities: null,
  fetchActivitiesSuccess: ['activitiesById'],
  fetchActivitiesFailure: ['error'],
  receiveActivities: ['activities'],
  activitySeen: ['activityId'],
  activitySeenFailure: ['error', 'activityId'],
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  entities: {},
  fetchStatus: {
    fetching: false,
    loaded: false,
  },
  activities: {},
  activitiesById: [],
  usersLikesById: {},
  usersBookmarksById: {},
  userFollowersByUserIdAndId: {},
  userFollowingByUserIdAndId: {},
  error: null,
})

/* ------------- Reducers ------------- */

export const loadUser = (state) => {
  return state.setIn(
    ['fetchStatus'],
    {fetching: true, loaded: false}
  )
}

export const loadUserSuccess = (state) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true
    },
    error: null
  })
}
export const loadUserFailure = (state, {error}) => {
  return state.merge({error, fetchStatus: {fetching: false, loaded: false}})
}
export const suggestions = (state) => {
  return state.setIn(
    ['fetchStatus', 'fetching'],
    true
  )
}
export const suggestionsSuccess = (state, {usersById = []}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    suggestedUsersById: usersById
  }, {
    deep: true
  })
}
export const suggestionsFailure = (state, {error}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: false
    },
    error
  })
}
export const receive = (state, {users = {}}) => {
  return state.merge({entities: users}, {deep: true})
}
export const updateUser = (state) => state.merge({
  error: null,
  updating: true
})
export const updateUserSuccess = (state, {user}) => {
  const path = ['entities', user.id]
  const updatedUser = state.getIn(path)
                           .merge(user, {deep: true})
  return state.setIn(path, updatedUser)
              .merge({error: null, updating: false})
}
export const updateUserFailure = (state, {error}) => {
  return state.merge({
    error,
    updating: false
  })
}
export const receiveLikes = (state, {userId, storyIds}) => state.setIn(
  ['usersLikesById', userId],
  storyIds
)
export const receiveBookmarks = (state, {userId, storyIds}) => state.setIn(
  ['usersBookmarksById', userId],
  storyIds
)

export const getByBookmarks = (state, userId) => {
  return state.getIn(['usersBookmarksById', userId], [])
}

export const toggleLike = (state, {userId, storyId}) => {
  const likes = _.get(state, `usersLikesById.${userId}`, [])
  if (_.includes(likes, storyId)) {
    return state.setIn(
      ['usersLikesById', userId],
      _.without(likes, storyId)
    )
  } else {
    return state.setIn(
      ['usersLikesById', userId],
      likes.concat(storyId)
    )
  }
}

export const toggleBookmark = (state, {userId, storyId}) => {
  const likes = _.get(state, `usersBookmarksById.${userId}`, [])
  if (_.includes(likes, storyId)) {
    return state.setIn(
      ['usersBookmarksById', userId],
      _.without(likes, storyId)
    )
  } else {
    return state.setIn(
      ['usersBookmarksById', userId],
      [storyId, ...likes]
    )
  }
}

export const loadUserFollowers = (state, {userId}) => {
  return state.setIn(
    ['userFollowersByUserIdAndId', userId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
}

export const loadUserFollowersSuccess = (state, {userId, usersById}) => {
  return state.setIn(
    ['userFollowersByUserIdAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: true}
  )
  .setIn(
    ['userFollowersByUserIdAndId', userId, 'byId'],
    usersById
  )
}

export const loadUserFollowersFailure = (state, {userId, error}) => {
  return state.setIn(
    ['userFollowersByUserIdAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: false, error}
  )
}

export const loadUserFollowing = (state, {userId}) => {
  return state.setIn(
    ['userFollowingByUserIdAndId', userId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
}

export const loadUserFollowingSuccess = (state, {userId, usersById}) => {
  return state.setIn(
    ['userFollowingByUserIdAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: true}
  )
  .setIn(
    ['userFollowingByUserIdAndId', userId, 'byId'],
    usersById
  )
}

export const loadUserFollowingFailure = (state, {userId, error}) => {
  return state.setIn(
    ['userFollowingByUserIdAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: false, error}
  )
}

export const followUser = (state, {userId, targetUserId}) =>
  state.setIn(
    ['userFollowingByUserIdAndId', userId, 'byId'],
    state.getIn(['userFollowingByUserIdAndId', userId, 'byId'], []).concat(targetUserId)
  )
  .setIn(
    ['entities', targetUserId, 'counts', 'followers'],
    state.getIn(['entities', targetUserId, 'counts', 'followers'], 0) + 1
  )
  .setIn(
    ['entities', userId, 'counts', 'following'],
    state.getIn(['entities', userId, 'counts', 'following'], 0) + 1
  )

export const unfollowUser = (state, {userId, targetUserId}) =>
  state.setIn(
    ['userFollowingByUserIdAndId', userId, 'byId'],
    _.without(state.getIn(['userFollowingByUserIdAndId', userId, 'byId'], []), targetUserId)
  )
  .setIn(
    ['entities', targetUserId, 'counts', 'followers'],
    state.getIn(['entities', targetUserId, 'counts', 'followers'], 0) - 1
  )
  .setIn(
    ['entities', userId, 'counts', 'following'],
    state.getIn(['entities', userId, 'counts', 'following'], 0) - 1
  )

export const fetchActivities = (state) => {
  return state.merge({fetchStatus: fetching()})
}

export const fetchActivitiesSuccess = (state, {activitiesById}) => {
  return state.merge({fetchStatus: fetchingSuccess(), activitiesById})
}

export const fetchActivitiesFailure = (state, {error}) => {
  return state.merge({fetchStatus: fetchingError(), error})
}

export const receiveActivities = (state, {activities}) => {
  return state.merge({activities}, {deep: true})
}

export const activitySeen = (state, {activityId}) => {
  return state.setIn(['activities', activityId, 'seen'], !state.getIn(['activities', activityId, 'seen']))
}

export const activitySeenFailure = (state, {activityId}) => {
  return state.setIn(['activities', activityId, 'seen'], !state.getIn(['activities', activityId, 'seen']))
}




/* -------------        Selectors        ------------- */
export const isInitialAppDataLoaded = (state, userId) => {
  return _.every([
    _.has(state.usersLikesById, userId)
  ])
}

export const isStoryLiked = (state: object, userId: string, storyId: string) => {
  return _.includes(state.getIn(['usersLikesById', userId]), storyId)
}

export const isStoryBookmarked = (state: object, userId: string, storyId: string) => {
  return _.includes(state.getIn(['usersBookmarksById', userId]), storyId)
}

export const getFollowers = (state: object, followersType: string, userId: string) => {
  if (followersType === 'followers') {
    return state.getIn(['userFollowersByUserIdAndId', userId, 'byId'], [])
  } else {
    return state.getIn(['userFollowingByUserIdAndId', userId, 'byId'], [])
  }
}

export const getFollowersFetchStatus = (state: object, followersType: string, userId: string) => {
  if (followersType === 'followers') {
    return state.getIn(['userFollowersByUserIdAndId', userId, 'fetchStatus'], [])
  } else {
    return state.getIn(['userFollowingByUserIdAndId', userId, 'fetchStatus'], [])
  }
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_USER_SUGGESTIONS_REQUEST]: suggestions,
  [Types.LOAD_USER_SUGGESTIONS_SUCCESS]: suggestionsSuccess,
  [Types.LOAD_USER_SUGGESTIONS_FAILURE]: suggestionsFailure,
  [Types.LOAD_USER]: loadUser,
  [Types.LOAD_USER_SUCCESS]: loadUserSuccess,
  [Types.LOAD_USER_FAILURE]: loadUserFailure,
  [Types.LOAD_USER_FOLLOWERS]: loadUserFollowers,
  [Types.LOAD_USER_FOLLOWERS_SUCCESS]: loadUserFollowersSuccess,
  [Types.LOAD_USER_FOLLOWERS_FAILURE]: loadUserFollowersFailure,
  [Types.LOAD_USER_FOLLOWING]: loadUserFollowing,
  [Types.LOAD_USER_FOLLOWING_SUCCESS]: loadUserFollowingSuccess,
  [Types.LOAD_USER_FOLLOWING_FAILURE]: loadUserFollowingFailure,
  [Types.FOLLOW_USER_SUCCESS]: followUser,
  [Types.FOLLOW_USER_FAILURE]: unfollowUser,
  [Types.UNFOLLOW_USER_SUCCESS]: unfollowUser,
  [Types.UNFOLLOW_USER_FAILURE]: followUser,
  [Types.UPDATE_USER]: updateUser,
  [Types.UPDATE_USER_SUCCESS]: updateUserSuccess,
  [Types.UPDATE_USER_FAILURE]: updateUserFailure,
  [Types.RECEIVE_USERS]: receive,
  [Types.RECEIVE_LIKES]: receiveLikes,
  [Types.RECEIVE_BOOKMARKS]: receiveBookmarks,
  [Types.USER_TOGGLE_LIKE]: toggleLike,
  [Types.USER_TOGGLE_BOOKMARK]: toggleBookmark,
  [Types.FETCH_ACTIVITIES]: fetchActivities,
  [Types.FETCH_ACTIVITIES_SUCCESS]: fetchActivitiesSuccess,
  [Types.FETCH_ACTIVITIES_FAILURE]: fetchActivitiesFailure,
  [Types.RECEIVE_ACTIVITIES]: receiveActivities,
  [Types.ACTIVITY_SEEN]: activitySeen,
  [Types.ACTIVITY_SEEN_FAILURE]: activitySeenFailure,
})
