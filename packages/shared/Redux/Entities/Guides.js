import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import changeCountOfType from '../helpers/changeCountOfTypeHelper'

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
  dismissError: null,
  likeGuideRequest: ['guideId', 'userId'],
  unlikeGuideRequest: ['guideId', 'userId'],
  likeGuide: ['guideId', 'userId'],
  unlikeGuide: ['guideId', 'userId'],
  changeCountOfType:['feedItemId', 'countType', 'isIncrement'],
  deleteStoryFromGuides: ['storyId'],
  adminGetGuides: ['params'],
  adminGetGuidesSuccess: ['res'],
  adminGetGuidesFailure: ['error'],
  adminGetGuide: ['id'],
  adminGetGuideSuccess: ['res'],
  adminGetGuideFailure: ['error'],
  adminPutGuide: ['payload'],
  adminPutGuideFailure: null,
  adminDeleteGuide: ['payload'],
  adminDeleteGuideSuccess: ['id'],
  adminDeleteGuideFailure: ['error'],
  adminRestoreGuides: ['payload'],
})

export const GuideTypes = Types
export default Creators

/* ------------- Initial State ------------- */
const initialFetchStatus = () => ({
  fetching: false,
  loaded: false,
})

export const INITIAL_STATE = Immutable({
  entities: {},
  fetchStatus: initialFetchStatus(),
  error: null,
  guideIdsByUserId: {},
  guideIdsByCategoryId: {},
  feedGuidesById: [],
  adminGuides: {
    fetchStatus: initialFetchStatus(),
    byId: [],
    total: 0,
    error: null,
    isDeleting: false,
    isUpdating: false,
    isRestoring: false,
    params: {
      page: 1,
      limit: 5
    }
  }
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

export const receiveGuides = (state, {guides = {} }) => {
  let newState = state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    entities: guides,
  }, {
    deep: true
  })

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
  let guide = state.getIn(['entities', guideId])
  let newState = state.setIn(['entities'], state.entities.without(guideId))
  newState = newState.setIn(
    ['fetchStatus'],
    {
      fetching: false,
      loaded: true,
    }
  )

  newState = newState.setIn(['feedGuidesById'], state.feedGuidesById.filter(id => {
    return id !== guideId
  }))

  newState = newState.setIn(
    ['guideIdsByUserId', userId],
    _.get(newState, `guideIdsByUserId.${userId}`, []).filter(id => {
      return id !== guideId
    })
  )

  _.get(guide, 'categories',[]).forEach(category => {
    newState = newState.setIn(
      ['guideIdsByCategoryId', category.id],
      _.get(newState, `guideIdsByCategoryId.${category.id}`, []).filter(id => {
        return id !== guideId
      })
    )
  })

  return newState
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

export const dismissError = (state, {error}) => {
  return state.setIn(['error'], null)
}


export const deleteStoryFromGuides = (state, {storyId}) => {
  const guides = state.entities
  const updatedGuides = {}
  for (let key in guides) {
    let guide = guides[key]
    if (guide.stories.indexOf(storyId) !== -1) {
      guide = guide.setIn(
        ['stories'],
        guide.stories.filter(filterStoryId => storyId !== filterStoryId)
      )
      updatedGuides[key] = guide
    }
  }

  return state.merge(
    {entities: updatedGuides},
    {deep: true}
  )
}

export const adminGetGuides = (state, { params = {} }) => {
  return state
    .setIn(
      ['adminGuides', 'fetchStatus'],
      {
        fetching: true,
        loaded: false
      })
    .setIn(
      ['adminGuides', 'params'],
      {
        ...state.adminGuides.params,
        ...params
      })
}

export const adminGetGuidesFailure = (state, { error }) => {
  return state
    .setIn(
      ['adminGuides', 'fetchStatus'],
      {
        fetching: false,
        loaded: false
      })
    .setIn(
      ['adminGuides', 'error'],
      error)
    .setIn(['adminGuides', 'isRestoring'], false)
}

export const adminGetGuidesSuccess = (state, { res }) => {
  return state
    .setIn(
      ['adminGuides', 'byId'],
      res.data)
    .setIn(
      ['adminGuides', 'total'],
      res.count)
    .setIn(
      ['adminGuides', 'fetchStatus'],
      {
        fetching: false,
        loaded: true
      })
    .setIn(
      ['adminGuides', 'error'],
      null)
    .setIn(['adminGuides', 'isRestoring'], false)
}

export const adminGetGuide = (state, { params = {} }) => {
  return state.setIn(['adminGuides', 'fetchStatus', 'fetching'], true)
}

export const adminGetGuideFailure = (state, { error }) => {
  return state
    .setIn(
      ['adminGuides', 'fetchStatus'],
      {
        fetching: false,
        loaded: false
      })
    .setIn(
      ['adminGuides', 'error'],
      error)
}


export const adminGetGuideSuccess = (state, { res }) => {
  let list = [...state.getIn(['adminGuides', 'byId'])]
  let total = state.getIn(['adminGuides', 'total'])
  const { record } = res
  const recordIndex = _.findIndex(list, { id: record.id })
  if (recordIndex >= 0) {
    list[recordIndex] = record
  } else {
    list.push(record)
    total = total + 1
  }
  return state
    .setIn(
      ['adminGuides', 'byId'],
      list)
    .setIn(
      ['adminGuides', 'total'],
      total)
    .setIn(
      ['adminGuides', 'fetchStatus'],
      {
        fetching: false,
        loaded: true
      })
    .setIn(
      ['adminGuides', 'error'],
      null)
    .setIn(
      ['adminGuides', 'isUpdating'],
      false)
}

export const adminDeleteGuide = (state) => {
  return state.setIn(['adminGuides', 'isDeleting'], true)
}

export const adminDeleteGuideFailure = (state) => {
  return state.setIn(['adminGuides', 'isDeleting'], false)
}

export const adminDeleteGuideSuccess = (state, { id }) => {
  const list = [...state.getIn(['adminGuides', 'byId'])]
  const recordIndex = _.findIndex(list, { id })
    
  return state.setIn(['adminGuides', 'byId', recordIndex, 'deleted'], true)
    .setIn(['adminGuides', 'isDeleting'], false)
}

export const adminPutGuide = (state) => {
  return state.setIn(['adminGuides', 'isUpdating'], true)
}

export const adminPutGuideFailure = (state) => {
  return state.setIn(['adminGuides', 'isUpdating'], false)
}

export const adminRestoreGuides = (state) => {
  return state.setIn(['adminGuides', 'isRestoring'], true)
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
  [Types.CHANGE_COUNT_OF_TYPE]: changeCountOfType,
  [Types.BULK_SAVE_STORY_TO_GUIDE_REQUEST]: request,
  [Types.DISMISS_ERROR]: dismissError,
  [Types.DELETE_STORY_FROM_GUIDES]: deleteStoryFromGuides,
  [Types.ADMIN_GET_GUIDES]: adminGetGuides,
  [Types.ADMIN_GET_GUIDES_FAILURE]: adminGetGuidesFailure,
  [Types.ADMIN_GET_GUIDES_SUCCESS]: adminGetGuidesSuccess,
  [Types.ADMIN_GET_GUIDE]: adminGetGuide,
  [Types.ADMIN_GET_GUIDE_FAILURE]: adminGetGuideFailure,
  [Types.ADMIN_GET_GUIDE_SUCCESS]: adminGetGuideSuccess,
  [Types.ADMIN_DELETE_GUIDE]: adminDeleteGuide,
  [Types.ADMIN_DELETE_GUIDE_FAILURE]: adminDeleteGuideFailure,
  [Types.ADMIN_DELETE_GUIDE_SUCCESS]: adminDeleteGuideSuccess,
  [Types.ADMIN_PUT_GUIDE]: adminPutGuide,
  [Types.ADMIN_PUT_GUIDE_FAILURE]: adminPutGuideFailure,
  [Types.ADMIN_RESTORE_GUIDES]: adminRestoreGuides,
})
