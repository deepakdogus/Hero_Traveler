import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createGuide: ['guide', 'userId'],
  createGuideSuccess: ['guides', 'userId'],
  receiveGuides: ['guides'],
  receiveUsersGuides: ['guides', 'userId'],
  createGuideFailure: ['error'],
  guideFailure: ['error'],
  updateGuide: ['guide'],
  getGuideRequest: ['guideId'],
  deleteGuideRequest: ['guideId', 'userId'],
  deleteGuideSuccess: ['guideId', 'userId'],
  getUserGuides: ['userId'],
  guideFeedRequest: ['userId'],
  guideFeedSuccess: ['feedGuidesById'],
  getCategoryGuides: ['categoryId'],
  getCategoryGuidesSuccess: ['categoryId', 'guideIds'],
  bulkSaveStoryToGuideRequest: ['storyId', 'isInGuide'],
})

export const GuideTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  entities: {},
  fetchStatus: {
    fetching: false,
    loaded: false,
  },
  error: null,
  guideIdsByUserId: {},
  guideIdsByCategoryId: {},
  feedGuidesById: [],
})

/* ------------- Reducers ------------- */

export const request = (state) => {
  return state.merge({
    fetchStatus: {
      fetching: true,
      loaded: false,
    },
    error: null
  }, {
    deep: true
  })
}

export const receiveGuides = (state, {guides = {}, userId = false}) => {
  let newState = state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    entities: guides,
  }, {
    deep: true
  })

  const newGuidesIds = Object.keys(guides)
  return newState
}


export const receiveUsersGuides = (state, {guides = {}, userId}) => {
  // only needs ids so getting the keys
  return state.setIn(['guideIdsByUserId', userId], Object.keys(guides))
}

export const receiveCategoryGuides = (state, {categoryId, guideIds = {}}) => {
  return state.setIn(['guideIdsByCategoryId', categoryId], guideIds)

}

export const receiveNewGuide = (state, {guides = {}, userId}) => {
  let newState = state
  const newGuidesIds = Object.keys(guides)
  const oldGuideIdsByUserId = state.guideIdsByUserId[userId]
  if (oldGuideIdsByUserId) {
    newState = newState.setIn(
      ['guideIdsByUserId', userId],
      [...newGuidesIds, ...oldGuideIdsByUserId]
    )
  }
  else newState = newState.setIn(['guideIdsByUserId', userId], [...newGuidesIds])

  newState = newState.setIn(
    ['feedGuidesById'],
    [...newGuidesIds, ...state.feedGuidesById]
  )
  return newState
}

export const deleteGuideSuccess = (state, {guideId, userId}) => {
  let newState = state.setIn(['entities'], state.entities.without(guideId))
  // add a line to remove from guideIdsByUserId in future
  return newState.setIn(['feedGuidesById'], state.feedGuidesById.filter(id => {
    return id !== guideId
  }))
}

export const guideFeedSuccess = (state, {feedGuidesById}) => {
  return state.setIn(['feedGuidesById'], feedGuidesById)
}

export const failure = (state, {error}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
    },
    error,
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_GUIDE]: request,
  [Types.CREATE_GUIDE_SUCCESS]: receiveNewGuide,
  [Types.RECEIVE_GUIDES]: receiveGuides,
  [Types.RECEIVE_USERS_GUIDES]: receiveUsersGuides,
  [Types.GUIDE_FAILURE]: failure,
  [Types.UPDATE_GUIDE]: request,
  [Types.GET_GUIDE]: request,
  [Types.DELETE_GUIDE_REQUEST]: request,
  [Types.DELETE_GUIDE_SUCCESS]: deleteGuideSuccess,
  [Types.GET_USER_GUIDES]: request,
  [Types.GUIDE_FEED_REQUEST]: request,
  [Types.GUIDE_FEED_SUCCESS]: guideFeedSuccess,
  [Types.GET_CATEGORY_GUIDES]: request,
  [Types.GET_CATEGORY_GUIDES_SUCCESS]: receiveCategoryGuides,
  [Types.BULK_SAVE_STORY_TO_GUIDE_REQUEST]: request,
})
