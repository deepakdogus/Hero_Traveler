import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import changeCountOfType from '../helpers/changeCountOfTypeHelper'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  storyRequest: ['storyId'],
  feedRequest: ['userId', 'params'],
  feedSuccess: ['userFeedById', 'count'],
  feedFailure: ['error'],
  likesAndBookmarksRequest: ['userId'],
  fromUserRequest: ['userId'],
  fromUserSuccess: ['userId', 'userStoriesById'],
  fromUserFailure: ['userId', 'error'],
  fromCategoryRequest: ['categoryId', 'storyType'],
  fromCategorySuccess: ['categoryId', 'categoryStoriesById'],
  fromCategoryFailure: ['categoryId', 'error'],
  loadDrafts: null,
  loadDraftsSuccess: ['draftsById'],
  loadDraftsFailure: ['error'],
  addDraft: ['draft'],
  removeDraft: ['draftId'],
  addBackgroundFailure: ['story', 'error', 'failedMethod'],
  removeBackgroundFailure: ['storyId'],
  setRetryingBackgroundFailure: ['storyId'],
  changeCountOfType: ['feedItemId', 'countType', 'isIncrement'],
  storyLike: ['userId', 'storyId'],
  flagStory: ['userId', 'storyId'],
  toggleBookmark: ['storyId', 'wasLiked'],
  storyBookmark: ['userId', 'storyId'],
  getBookmarks: ['userId'],
  getBookmarksSuccess: ['userId', 'bookmarks'],
  getBookmarksFailure: ['userId', 'error'],
  receiveStories: ['stories'],
  addUserStory: ['stories', 'draftId'],
  deleteStory: ['userId', 'storyId'],
  deleteStorySuccess: ['userId', 'storyId'],
  getGuideStories: ['guideId'],
})

export const StoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const initialFetchStatus = () => ({
  fetching: false,
  loaded: false,
})

export const INITIAL_STATE = Immutable({
  entities: {},
  userFeedById: [],
  userStoryFeedCount: 9999999999,
  storiesByUserAndId: {},
  storiesByCategoryAndId: {},
  backgroundFailures: {},
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

// request the temperature for a city
export const feedRequest = (state, { userId, params }) => {
  return state.setIn(
    ['fetchStatus', 'fetching'],
    true
  );
}
// successful temperature lookup
export const feedSuccess = (state, {userFeedById, count}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    userFeedById,
    userStoryFeedCount: count,
    error: null
  }, {
    deep: true
  })
}

export const userRequest = (state, {userId}) => {
  return state.setIn(
    ['storiesByUserAndId', userId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
  .setIn(
    ['storiesByUserAndId', userId, 'byId'],
    []
  )
}

export const userSuccess = (state, {userId, userStoriesById}) => {
  return state.setIn(
    ['storiesByUserAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: true}
  )
  .setIn(
    ['storiesByUserAndId', userId, 'byId'],
    userStoriesById
  )
}

export const userFailure = (state, {userId, error}) => {
  const derivedById = _.values(state.entities).filter(story => {
    return !story.draft && story.author === userId
  }).map(story => story.id)

  return state.setIn(
    ['storiesByUserAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: false, error}
  )
  .setIn(
    ['storiesByUserAndId', userId, 'byId'],
    derivedById
  )
}

export const getBookmarks = (state, {userId}) => {
  return state.setIn(
    ['bookmarks', userId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
}

export const getBookmarksSuccess = (state, {userId, bookmarks}) => {
  return state.setIn(
    ['bookmarks', userId, 'fetchStatus'],
    {fetching: false, loaded: true}
  )
}

export const getBookmarksFailure = (state, {userId, error}) => {
  return state.setIn(
    ['bookmarks', userId, 'fetchStatus'],
    {fetching: false, loaded: false, error}
  )
}

export const categoryRequest = (state, {categoryId}) => {
  const errorLessState = state.setIn(['error'], null)
  return errorLessState.setIn(
    ['storiesByCategoryAndId', categoryId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
}

export const categorySuccess = (state, {categoryId, categoryStoriesById}) => {
  return state.setIn(
    ['storiesByCategoryAndId', categoryId, 'fetchStatus'],
    {fetching: false, loaded: true}
  )
  .setIn(
    ['storiesByCategoryAndId', categoryId, 'byId'],
    categoryStoriesById
  )
}

export const categoryFailure = (state, {categoryId, error}) => {
  const derivedStoriesById = _.values(state.entities).filter(story => {
    return story.categories.some(category => {
      return category.id === categoryId
    })
  }).map(story => story.id)

  return state.setIn(
    ['storiesByCategoryAndId', categoryId, 'fetchStatus'],
    {fetching: false, loaded: false}
  )
  .setIn(
    ['storiesByCategoryAndId', categoryId, 'byId'],
    derivedStoriesById
  )
  .setIn(['error'], error)
}

export const failure = (state, {error}) =>
  state.merge({
    fetchStatus: {
      fetching: false,
      loaded: false
    },
    error
  }, {
    deep: true
  })

export const updateEntities = (state, {stories = {}}) => {
  return state.merge({entities: stories}, {deep: true})
}

export const addUserStory = (state, {stories = {}, draftId}) => {
  state = updateEntities(state, {stories})
  const story = stories[Object.keys(stories)[0]]

  let userStoriesMeta = state.storiesByUserAndId[story.author]
  if (!userStoriesMeta) userStoriesMeta = { "byId": []}
  let userStoriesById = userStoriesMeta.byId
  // adding to list of user's stories
  if (story && userStoriesById.indexOf(story.id) === -1) {
    userStoriesById = [story.id, ...userStoriesById]
    const userFeedById = [story.id, ...state.userFeedById]

    // updating fetchstatus and user's storiesByUserAndId
    state = userSuccess(state, {
      userId: story.author,
      userStoriesById,
    })
    state = state.merge({userFeedById})

  }
  return removeDraft(state, {draftId})
}

export const loadDrafts = (state) => {
  return state.merge({
    drafts: {
      error: null,
      fetchStatus: {
        fetching: true,
        loaded: false
      },
      byId: []
    }
  })
}

export const loadDraftsSuccess = (state, {draftsById}) => {
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

export const loadDraftsFailure = (state, {error}) => {
  const derivedById = _.values(state.entities).filter(story => {
    return story.draft
  }).map(story => story.id)
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

export const addDraft = (state, {draft}) => {
  const stories = {}
  stories[draft.id] = draft
  state = updateEntities(state, {stories})

  let draftsById = state.drafts.byId
  if (draftsById.indexOf(draft.id) === -1) draftsById = [draft.id, ...draftsById]
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
export const removeDraft = (state, {draftId}) => {
  if (draftId.substring(0,6) === 'local-') state = state.setIn(['entities'], state.entities.without(draftId))
  state = removeBackgroundFailure(state, {storyId: draftId})
  const path = ['drafts', 'byId']
  return state.setIn(path, state.getIn(path, draftId).filter(id => {
    return id !== draftId
  }))
}

export const addBackgroundFailure = (state, {story, error, failedMethod}) => {
  const failureObj = {}
  failureObj[story.id] = {
    story,
    error,
    failedMethod,
    status: 'failed',
  }
  return state.merge({backgroundFailures: failureObj}, {deep: true})
}

export const removeBackgroundFailure = (state, {storyId}) => {
  return  state.setIn(['backgroundFailures'], state.backgroundFailures.without(storyId))
}

export const setRetryingBackgroundFailure = (state, {storyId}) => {
  if (state.backgroundFailures[storyId]){
    return state.setIn(['backgroundFailures', storyId, 'status'], 'retrying')
  }
  return state
}

export const deleteStory = (state, {userId, storyId}) => {
  return state
}

export const deleteStorySuccess = (state, {userId, storyId}) => {
  let newState = state.setIn(['entities'], state.entities.without(storyId))
  newState = newState.setIn(['userFeedById'], _.without(state.userFeedById, storyId))

  const story = state.entities[storyId]
  const path = story.draft ? ['drafts', 'byId'] : ['storiesByUserAndId', userId, 'byId']
  return newState.setIn(path, _.without(state.getIn(path), storyId))
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


// export const getIdsByUser = (state, userId: string) => {
//   return state.getIn(['storiesByUser', userId, 'byId'], [])
// }

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FEED_REQUEST]: feedRequest,
  [Types.FEED_SUCCESS]: feedSuccess,
  [Types.FEED_FAILURE]: failure,
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
  [Types.ADD_BACKGROUND_FAILURE]: addBackgroundFailure,
  [Types.REMOVE_BACKGROUND_FAILURE]: removeBackgroundFailure,
  [Types.SET_RETRYING_BACKGROUND_FAILURE]: setRetryingBackgroundFailure,
  [Types.CHANGE_COUNT_OF_TYPE]: changeCountOfType,
  [Types.RECEIVE_STORIES]: updateEntities,
  [Types.ADD_USER_STORY]: addUserStory,
  [Types.DELETE_STORY]: deleteStory,
  [Types.DELETE_STORY_SUCCESS]: deleteStorySuccess,
  [Types.GET_BOOKMARKS]: getBookmarks,
  [Types.GET_BOOKMARKS_SUCCESS]: getBookmarksSuccess,
  [Types.GET_BOOKMARKS_FAILURE]: getBookmarksFailure,
})
