import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/**
 * 
 * Types and Action Creators
 * 
 **/
const { Types, Creators } = createActions({
  postcardRequest: ['userId', 'params'],
  postcardSuccess: ['userFeedById', 'count', 'params'],
  postcardFailure: ['error'],
  addUserPostcard: ['stories', 'draftId'],
  deletePostcard: ['userId', 'storyId'],
  deletePostcardSuccess: ['userId', 'storyId'],
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

const dummyData = [
  {
    coverImage: 'https://images.unsplash.com/photo-1551704309-a8876f22745d',
    caption: 'Winter Mountains'
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1551801234-6304319ed9bc',
    caption: 'Wild Ice Hokey'
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1551890312-1ea3beb91e0f',
    caption: 'City Tram'
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1551852121-6ba2913274a1',
    caption: 'Puppy'
  }
]

export const INITIAL_STATE = Immutable({
  entities: dummyData,
  fetchStatus: initialFetchStatus(),
  error: null,
})

/**
 * 
 * Reducers
 * 
 **/
const postcardRequest = (state) => {
  return state
}

const postcardSuccess = (state) => {
  return state
}

const postcardFailure = (state) => {
  return state
}

const addUserRequest = (state) => {
  return state
}

const deletePostcard = (state) => {
  return state
}

const deletePostcardSuccess = (state) => {
  return state
}

/**
 * 
 * Hookup Reducers To Types
 * 
 **/
export const reducer = createReducer(INITIAL_STATE, {
  [Types.POSTCARD_REQUEST]: postcardRequest,
  [Types.POSTCARD_SUCCESS]: postcardSuccess,
  [Types.POSTCARD_FAILURE]: postcardFailure,
  [Types.ADD_USER_POSTCARD]: addUserRequest,
  [Types.DELETE_POSTCARD]: deletePostcard,
  [Types.DELETE_POSTCARD_SUCCESS]: deletePostcardSuccess,
})
