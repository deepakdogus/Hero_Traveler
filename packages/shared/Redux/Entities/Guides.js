import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createGuide: ['guide'],
  receiveGuides: ['guides', 'isOwnGuide'],
  createGuideFailure: ['error'],
  updateGuide: ['guide'],
  getGuideRequest: ['guideId'],
  deleteGuideRequest: ['guideId', 'userId'],
  deleteGuideSuccess: ['guideId', 'userId'],
  getUserGuides: ['userId'],
  guideFeedRequest: ['userId'],
  guideFeedSuccess: ['feedGuidesById'],
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

export const receiveGuides = (state, {guides = {}, isOwnGuide = false}) => {
  let newState = state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    entities: guides,
  }, {
    deep: true
  })
  if (isOwnGuide) {
    const newGuidesIds = Object.keys(guides)
    newState.merge({
      feedGuidesById: [...newGuidesIds, ...state.feedGuidesById],
    })
  }
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

export const failure = (state, {error}) =>
  state.merge({fetching: false, error})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_GUIDE]: request,
  [Types.RECEIVE_GUIDES]: receiveGuides,
  [Types.GUIDE_FAILURE]: failure,
  [Types.UPDATE_GUIDE]: request,
  [Types.GET_GUIDE]: request,
  [Types.DELETE_GUIDE_REQUEST]: request,
  [Types.DELETE_GUIDE_SUCCESS]: deleteGuideSuccess,
  [Types.GET_USER_GUIDES]: request,
  [Types.GUIDE_FEED_REQUEST]: request,
  [Types.GUIDE_FEED_SUCCESS]: guideFeedSuccess,
})
