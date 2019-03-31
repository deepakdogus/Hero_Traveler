import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/**
 *
 * Types and Action Creators
 *
 **/
const { Types, Creators } = createActions({
  getPostcardRequest: ['cardId'],
  getPostcardSuccess: ['postcard'],
  getPostcardFailure: ['error'],
  getPostcardsRequest: [],
  getPostcardsSuccess: ['postcards'],
  getPostcardsFailure: ['error'],
  createPostcardRequest: ['postcard'],
  createPostcardSuccess: ['postcard'],
  createPostcardFailure: ['error'],
  deletePostcardRequest: ['cardId'],
  deletePostcardSuccess: ['cardId'],
  deletePostcardFailure: ['error'],
  initializeSyncProgress: ['numSteps', 'message'],
  incrementSyncProgress: ['steps'],
  syncError: null,
  resetSync: null
})

export const PostcardTypes = Types
export default Creators

/**
 *
 * Initial State
 *
 **/
const initialFetchStatus = () => ({
  fetching: false,
  loaded: false
})

export const INITIAL_STATE = Immutable({
  postcards: [],
  postcard: {},
  sync: {
    syncProgress: 0,
    syncProgressSteps: 0,
    message: '',
    error: false
  },
  fetchStatus: initialFetchStatus(),
  error: null
})

/**
 *
 * Reducers
 *
 **/
const getPostcardRequest = state => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    }
  })
}

const getPostcardSuccess = (state, { postcard }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    postcard,
    error: false
  })
}

const getPostcardFailure = (state, { error }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error: error
  })
}

const getPostcardsRequest = state => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    }
  })
}

const getPostcardsSuccess = (state, { postcards }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    postcards,
    error: false
  })
}

const getPostcardsFailure = (state, { error }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error
  })
}

const createPostcardRequest = (state, { postcard }) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    },
    postcard
  })
}

const createPostcardSuccess = (state, { postcard }) => {
  return state.merge(
    {
      fetchStatus: {
        loaded: true,
        fetching: false
      },
      postcards: [postcard, ...state.postcards],
      error: false
    },
    { deep: true }
  )
}

const createPostcardFailure = (state, { error }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error
  })
}

const deletePostcardRequest = (state, { cardId }) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    },
    cardId
  })
}

const deletePostcardSuccess = state => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    postcard,
    error: false
  })
}

const deletePostcardFailure = state => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error
  })
}

export const initializeSyncProgress = (state, {numSteps, message}) => {
  return state.merge({
    sync: {
      syncProgress: 0,
      syncProgressSteps: numSteps,
      message,
      error: false,
    }
  })
}

const incrementSyncProgress = (state, { steps = 1 }) => {
  return state.setIn(
    ['sync', 'syncProgress'],
    state.sync.syncProgress + steps
  )
}

const syncError = state => {
  const updatedState = state.setIn(['sync', 'error'], true)
  return updatedState.setIn(
    ['sync', 'message'],
    'Publish Failure: Please Retry'
  )
}

const resetSync = state => {
  return state.merge({
    sync: {
      syncProgress: 0,
      syncProgressSteps: 0,
      message: 'Publishing Postcard',
      error: false
    }
  })
}

/**
 *
 * Hookup Reducers To Types
 *
 **/
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_POSTCARD_REQUEST]: getPostcardRequest,
  [Types.GET_POSTCARD_SUCCESS]: getPostcardSuccess,
  [Types.GET_POSTCARD_FAILURE]: getPostcardFailure,
  [Types.GET_POSTCARDS_REQUEST]: getPostcardsRequest,
  [Types.GET_POSTCARDS_SUCCESS]: getPostcardsSuccess,
  [Types.GET_POSTCARDS_FAILURE]: getPostcardsFailure,
  [Types.CREATE_POSTCARD_REQUEST]: createPostcardRequest,
  [Types.CREATE_POSTCARD_SUCCESS]: createPostcardSuccess,
  [Types.CREATE_POSTCARD_FAILURE]: createPostcardFailure,
  [Types.DELETE_POSTCARD_REQUEST]: deletePostcardRequest,
  [Types.DELETE_POSTCARD_SUCCESS]: deletePostcardSuccess,
  [Types.DELETE_POSTCARD_FAILURE]: deletePostcardFailure,
  [Types.INITIALIZE_SYNC_PROGRESS]: initializeSyncProgress,
  [Types.INCREMENT_SYNC_PROGRESS]: incrementSyncProgress,
  [Types.SYNC_ERROR]: syncError,
  [Types.RESET_SYNC]: resetSync
})
