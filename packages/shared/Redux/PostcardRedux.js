import _ from 'lodash'
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
  loaded: false,
})

export const INITIAL_STATE = Immutable({
  postcards: [],
  fetchStatus: initialFetchStatus(),
  error: null,
})

/**
 * 
 * Reducers
 * 
 **/
const getPostcardRequest = (state, { cardId }) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    },
    cardId,
  })
}

const getPostcardSuccess = (state, { postcard }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    postcard,
    error: false,
  })
}

const getPostcardFailure = (state, { error }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error: error,
  })
}

const getPostcardsRequest = (state) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    },
  })
}

const getPostcardsSuccess = (state) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error: false,
  })
}

const getPostcardsFailure = (state, { error }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error,
  })
}

const createPostcardRequest = (state, { postcard }) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    },
    postcard,
  })
}

const createPostcardSuccess = (state, { postcard }) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    postcard,
    error: false,
  })
}

const createPostcardFailure = (state) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error,
  })
}

const deletePostcardRequest = (state, { cardId }) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    },
    cardId,
  })
}

const deletePostcardSuccess = (state) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    postcard,
    error: false,
  })
}

const deletePostcardFailure = (state) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    error,
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
})
