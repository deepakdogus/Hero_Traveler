import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import findIndex from 'lodash/findIndex'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetStories: ['params'],
  adminGetStoriesSuccess: ['res'],
  adminGetStoriesFailure: ['error'],
  adminGetStory: ['id'],
  adminGetStorySuccess: ['res'],
  adminGetStoryFailure: ['error'],
  adminPutStory: ['payload'],
  adminDeleteStory: ['payload'],
  adminDeleteStorySuccess: ['id'],
  adminRestoreStories: ['payload'],
})

export const AdminStoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isLoading: false,
  list: [],
  total: 0,
  error: null,
  params: {
    page: 1,
    limit: 5
  }
})


export const adminGetStories = (state, { params = {} }) => {
  return state.merge({
    isLoading: true,
    params: {
      ...state.params,
      ...params
    }
  }, {
    deep: true
  })
}

export const adminGetStoriesFailure = (state, { error }) => {
  return state.merge({
    error,
    isLoading: false
  })
}

export const adminGetStoriesSuccess = (state, { res }) => {
  return state.merge({
    ...state,
    list: res.data,
    total: res.count,
    isLoading: false,
    error: null
  },
  {
    deep: true
  })
}

export const adminGetStory = (state, { params = {} }) => {
  return state.setIn(['isLoading'], true)
}


export const adminGetStoryFailure = (state, { error }) => {
  return state.merge({
    error,
    isLoading: false
  })
}


export const adminGetStorySuccess = (state, { res }) => {
  let list = [...state.getIn(['list'])]
  let total = state.getIn(['total'])
  const { record } = res
  const index = findIndex(list, { id: record.id })
  if (index >= 0) {
    list[index] = record
  } else {
    list.push(record)
    total = total + 1
  }
  return state.merge({
    ...state,
    list,
    total,
    isLoading: false,
    error: null
  },
  {
    deep: true
  })
}

export const adminDeleteStorySuccess = (state, { id }) => {
  let list = [...state.getIn(['list'])]
  let total = state.getIn(['total'])
  const index = findIndex(list, { id })
  return state.setIn(['list', index, 'isDeleted'], true)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_STORIES]: adminGetStories,
  [Types.ADMIN_GET_STORIES_FAILURE]: adminGetStoriesFailure,
  [Types.ADMIN_GET_STORIES_SUCCESS]: adminGetStoriesSuccess,
  [Types.ADMIN_GET_STORY]: adminGetStory,
  [Types.ADMIN_GET_STORY_FAILURE]: adminGetStoryFailure,
  [Types.ADMIN_GET_STORY_SUCCESS]: adminGetStorySuccess,
  [Types.ADMIN_DELETE_STORY_SUCCESS]: adminDeleteStorySuccess,
})

/* ------------- Selectors ------------- */

