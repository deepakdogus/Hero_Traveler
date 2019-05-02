import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import changeCountOfType from '../helpers/changeCountOfTypeHelper'
import isLocalDraft from '../../Lib/isLocalDraft'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  storyRequest: ['storyId'],
  feedRequest: ['userId', 'params'],
  nearbyFeedRequest: ['nearbyStoryIds'],
  badgeUserFeedRequest: null,
  userFeedSuccess: ['userFeedById', 'count', 'params'],
  nearbyFeedSuccess: ['nearbyFeedById', 'count', 'params'],
  badgeUserFeedSuccess: ['badgeUserFeedById', 'count', 'params'],
  userFeedFailure: ['error'],
  nearbyFeedFailure: ['error'],
  badgeUserFeedFailure: ['error'],
  likesAndBookmarksRequest: ['userId'],
  fromUserRequest: ['userId'],
  fromUserSuccess: ['userId', 'userStoriesById'],
  fromUserFailure: ['userId', 'error'],
  fromCategoryRequest: ['categoryId', 'storyType'],
  fromCategorySuccess: ['categoryId', 'categoryStoriesById'],
  fromCategoryFailure: ['categoryId', 'error'],
  loadDrafts: null,
  loadDraftsSuccess: ['draftsById'],
  loadDraftsFailure: ['error', 'userId'],
  addDraft: ['draft'],
  removeDraft: ['draftId'],
  resetDrafts: null,
  changeCountOfType: ['feedItemId', 'countType', 'isIncrement'],
  flagStory: ['userId', 'storyId'],
  storyBookmark: ['userId', 'storyId'],
  getBookmarks: ['userId'],
  getBookmarksSuccess: ['userId', 'bookmarks'],
  getBookmarksFailure: ['userId', 'error'],
  receiveStories: ['stories'],
  addUserStory: ['stories', 'draftId'],
  deleteStory: ['userId', 'storyId'],
  deleteStorySuccess: ['userId', 'storyId'],
  removeDeletedStories: ['deleteStories'],
  getGuideStories: ['guideId'],
  getDeletedStories: ['userId'],
  likeStoryRequest: ['storyId', 'userId'],
  unlikeStoryRequest: ['storyId', 'userId'],
  bookmarkStoryRequest: ['storyId'],
  removeStoryBookmarkRequest: ['storyId'],
  syncPendingUpdates: null,
  storyFailure: ['error']
})

export const StoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const initialFetchStatus = () => ({
  fetching: false,
  loaded: false
})

export const INITIAL_STATE = Immutable({
  entities: {},
  userFeedById: [],
  nearbyFeedById: [],
  badgeUserFeedById: [],
  userFeedCount: 9999999999,
  nearbyFeedCount: 9999999999,
  badgeUserFeedCount: 9999999999,
  storiesByUserAndId: {},
  storiesByCategoryAndId: {},
  fetchStatus: initialFetchStatus(),
  userStoriesFetchStatus: initialFetchStatus(),
  userBookmarksFetchStatus: initialFetchStatus(),
  error: null,
  drafts: {
    error: null,
    fetchStatus: initialFetchStatus(),
    byId: []
  }
})

/* ------------- Reducers ------------- */

export const feedRequest = state => {
  return state.setIn(['fetchStatus', 'fetching'], true)
}

export const genericFeedSuccess = (state, type, feedById, count, params) => {
  let feedUpdate = feedById
  if (_.get(params, 'page', 1) > 1) {
    feedUpdate = [...state.feedById]
    feedById.forEach(id => !feedUpdate.includes(id) && feedUpdate.push(id))
  }

  return state.merge(
    {
      fetchStatus: {
        fetching: false,
        loaded: true
      },
      [`${type}FeedById`]: feedUpdate,
      [`${type}FeedCount`]: count,
      error: null
    },
    {
      deep: true
    }
  )
}

export const userFeedSuccess = (state, { userFeedById, count, params }) =>
  genericFeedSuccess(state, 'user', userFeedById, count, params)

export const nearbyFeedSuccess = (state, { nearbyFeedById, count, params }) =>
  genericFeedSuccess(state, 'nearby', nearbyFeedById, count, params)

export const badgeUserFeedSuccess = (
  state,
  { badgeUserFeedById, count, params }
) => genericFeedSuccess(state, 'badgeUser', badgeUserFeedById, count, params)

export const userRequest = (state, { userId }) => {
  return state.setIn(['storiesByUserAndId', userId, 'fetchStatus'], {
    fetching: true,
    loaded: false
  })
}

export const userSuccess = (state, { userId, userStoriesById }) => {
  return state
    .setIn(['storiesByUserAndId', userId, 'fetchStatus'], {
      fetching: false,
      loaded: true
    })
    .setIn(['storiesByUserAndId', userId, 'byId'], userStoriesById)
}

export const userFailure = (state, { userId, error }) => {
  const derivedById = _.values(state.entities)
    .filter(story => {
      return !story.draft && story.author === userId
    })
    .map(story => story.id)

  return state
    .setIn(['storiesByUserAndId', userId, 'fetchStatus'], {
      fetching: false,
      loaded: false,
      error
    })
    .setIn(['storiesByUserAndId', userId, 'byId'], derivedById)
}

export const getBookmarks = (state, { userId }) => {
  return state.setIn(['bookmarks', userId, 'fetchStatus'], {
    fetching: true,
    loaded: false
  })
}

export const getBookmarksSuccess = (state, { userId, bookmarks }) => {
  return state.setIn(['bookmarks', userId, 'fetchStatus'], {
    fetching: false,
    loaded: true
  })
}

export const getBookmarksFailure = (state, { userId, error }) => {
  return state.setIn(['bookmarks', userId, 'fetchStatus'], {
    fetching: false,
    loaded: false,
    error
  })
}

export const categoryRequest = (state, { categoryId }) => {
  const errorLessState = state.setIn(['error'], null)
  return errorLessState.setIn(
    ['storiesByCategoryAndId', categoryId, 'fetchStatus'],
    { fetching: true, loaded: false }
  )
}

export const categorySuccess = (state, { categoryId, categoryStoriesById }) => {
  return state
    .setIn(['storiesByCategoryAndId', categoryId, 'fetchStatus'], {
      fetching: false,
      loaded: true
    })
    .setIn(['storiesByCategoryAndId', categoryId, 'byId'], categoryStoriesById)
}

export const categoryFailure = (state, { categoryId, error }) => {
  const derivedStoriesById = _.values(state.entities)
    .filter(story => {
      return story.categories.some(category => {
        return category.id === categoryId
      })
    })
    .map(story => story.id)

  return state
    .setIn(['storiesByCategoryAndId', categoryId, 'fetchStatus'], {
      fetching: false,
      loaded: false
    })
    .setIn(['storiesByCategoryAndId', categoryId, 'byId'], derivedStoriesById)
    .setIn(['error'], error)
}

export const failure = (state, { error }) =>
  state.merge(
    {
      fetchStatus: {
        fetching: false,
        loaded: false
      },
      error
    },
    {
      deep: true
    }
  )

export const updateEntities = (state, { stories = {} }) => {
  return state.merge({ entities: stories }, { deep: true })
}

export const addUserStory = (state, { stories = {}, draftId }) => {
  state = updateEntities(state, { stories })
  const story = stories[Object.keys(stories)[0]]

  let userStoriesMeta = state.storiesByUserAndId[story.author]
  if (!userStoriesMeta) userStoriesMeta = { byId: [] }
  let userStoriesById = userStoriesMeta.byId
  // adding to list of user's stories
  if (story && userStoriesById.indexOf(story.id) === -1) {
    userStoriesById = [story.id, ...userStoriesById]
    const userFeedById = [story.id, ...state.userFeedById]

    // updating fetchstatus and user's storiesByUserAndId
    state = userSuccess(state, {
      userId: story.author,
      userStoriesById
    })
    state = state.merge({ userFeedById })
  }
  return removeDraft(state, { draftId })
}

export const loadDrafts = state => {
  return state.merge({
    drafts: {
      error: null,
      fetchStatus: {
        fetching: true,
        loaded: false
      },
      byId: state.drafts.byId
    }
  })
}

export const loadDraftsSuccess = (state, { draftsById }) => {
  return state.merge({
    drafts: {
      fetchStatus: {
        fetching: false,
        loaded: true
      },
      byId: draftsById
    }
  })
}

export const loadDraftsFailure = (state, { error, userId }) => {
  const derivedById = _.values(state.entities)
    .filter(story => {
      return story.draft && story.author === userId
    })
    .map(story => story.id)
  return state.merge({
    drafts: {
      error,
      fetchStatus: {
        fetching: false,
        loaded: false
      },
      byId: derivedById
    }
  })
}

export const addDraft = (state, { draft }) => {
  const stories = {}
  stories[draft.id] = draft
  state = updateEntities(state, { stories })

  let draftsById = state.drafts.byId
  if (draftsById.indexOf(draft.id) === -1) {
    draftsById = [draft.id, ...draftsById]
  }
  return state.merge({
    drafts: {
      fetchStatus: {
        fetching: false,
        loaded: true
      },
      byId: draftsById
    }
  })
}

// if local id removes from story entities if present
// removes from drafts.byId
export const removeDraft = (state, { draftId }) => {
  if (isLocalDraft(draftId)) {
    state = state.setIn(['entities'], state.entities.without(draftId))
  }
  const path = ['drafts', 'byId']
  return state.setIn(
    path,
    state.getIn(path, draftId).filter(id => {
      return id !== draftId
    })
  )
}

export const resetDrafts = (state, { storyId }) => {
  return state.setIn(['drafts'], INITIAL_STATE.drafts)
}

export const deleteStory = (state, { userId, storyId }) => {
  return state
}

export const deleteStorySuccess = (state, { userId, storyId }) => {
  let newState = state.setIn(['entities'], state.entities.without(storyId))
  newState = newState.setIn(
    ['userFeedById'],
    _.without(state.userFeedById, storyId)
  )

  const story = state.entities[storyId]
  const path = story.draft
    ? ['drafts', 'byId']
    : ['storiesByUserAndId', userId, 'byId']
  return newState.setIn(path, _.without(state.getIn(path), storyId))
}

export const removeDeletedStories = (state, { deleteStories = [{}] }) => {
  return deleteStories.reduce((workingState, story) => {
    const cachedStory = state.entities[story.id]
    if (cachedStory) {
      return deleteStorySuccess(state, {
        userId: cachedStory.author,
        storyId: story.id
      })
    }
    return workingState
  }, state)
}

/* ------------- Selectors ------------- */

export const getByCategory = (state, categoryId) => {
  return state.getIn(['storiesByCategoryAndId', categoryId, 'byId'], [])
}

export const getFetchStatus = (state, categoryId) => {
  return state.getIn(['storiesByCategoryAndId', categoryId, 'fetchStatus'], {})
}

export const getByUser = (state, userId) => {
  return state.getIn(['storiesByUserAndId', userId, 'byId'], [])
}

export const getUserFetchStatus = (state, userId) => {
  return state.getIn(['storiesByUserAndId', userId, 'fetchStatus'], {})
}

export const getBookmarksFetchStatus = (state, userId) => {
  return state.getIn(['bookmarks', userId, 'fetchStatus'], {})
}

export const genericFailure = (state, { error }) => {
  return state.merge({
    fetchStatus: {
      fetching: false
    },
    error
  })
}

// export const getIdsByUser = (state, userId: string) => {
//   return state.getIn(['storiesByUser', userId, 'byId'], [])
// }

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FEED_REQUEST]: feedRequest,
  [Types.NEARBY_FEED_REQUEST]: feedRequest,
  [Types.BADGE_USER_FEED_REQUEST]: feedRequest,
  [Types.USER_FEED_SUCCESS]: userFeedSuccess,
  [Types.NEARBY_FEED_SUCCESS]: nearbyFeedSuccess,
  [Types.BADGE_USER_FEED_SUCCESS]: badgeUserFeedSuccess,
  [Types.USER_FEED_FAILURE]: failure,
  [Types.NEARBY_FEED_FAILURE]: failure,
  [Types.BADGE_USER_FEED_FAILURE]: failure,
  [Types.FROM_USER_REQUEST]: userRequest,
  [Types.FROM_USER_SUCCESS]: userSuccess,
  [Types.FROM_USER_FAILURE]: userFailure,
  [Types.FROM_CATEGORY_REQUEST]: categoryRequest,
  [Types.FROM_CATEGORY_SUCCESS]: categorySuccess,
  [Types.FROM_CATEGORY_FAILURE]: categoryFailure,
  [Types.LOAD_DRAFTS]: loadDrafts,
  [Types.LOAD_DRAFTS_SUCCESS]: loadDraftsSuccess,
  [Types.LOAD_DRAFTS_FAILURE]: loadDraftsFailure,
  [Types.ADD_DRAFT]: addDraft,
  [Types.REMOVE_DRAFT]: removeDraft,
  [Types.REMOVE_DELETED_STORIES]: removeDeletedStories,
  [Types.RESET_DRAFTS]: resetDrafts,
  [Types.CHANGE_COUNT_OF_TYPE]: changeCountOfType,
  [Types.RECEIVE_STORIES]: updateEntities,
  [Types.ADD_USER_STORY]: addUserStory,
  [Types.DELETE_STORY]: deleteStory,
  [Types.DELETE_STORY_SUCCESS]: deleteStorySuccess,
  [Types.GET_BOOKMARKS]: getBookmarks,
  [Types.GET_BOOKMARKS_SUCCESS]: getBookmarksSuccess,
  [Types.GET_BOOKMARKS_FAILURE]: getBookmarksFailure,
  [Types.STORY_FAILURE]: genericFailure
})
