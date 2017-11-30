import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getCommentsRequest: ['storyId'],
  getCommentsSuccess: ['comments'],
  commentRequestFailure: ['error', 'request'],
  createCommentRequest: ['storyId', 'text'],
  createCommentSuccess: ['comment'],
})

export const StoryCommentsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  comments: [],
  getCommentsStatus: {
    fetching: false,
    loaded: false,
  },
  createCommentStatus: {
    creating: false,
  },
  error: null,
})

/* ------------- Reducers ------------- */

export const getCommentsRequest = (state) => {
  return state.merge({
    getCommentsStatus: {
      fetching: true,
      loaded: false,
    }
  })
}

export const getCommentsSuccess = (state, {comments = []}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    comments: comments
  }, {
    deep: true
  })
}

export const commentRequestFailure = (state, {error, request}) => {
  let update = {error: error}
  if (request === 'get') update.getCommentsStatus = {
    fetching: false,
    loaded: false,
  }
  else if (request === 'create') update.createCommentStatus = { creating: false }
  return state.merge(update)
}

export const createCommentRequest = (state) => {
  return state.merge({
    createCommentStatus: {
      creating: true,
    }
  })
}

export const createCommentSuccess = (state, {comment}) => {
  return state.setIn(
    ['comments'],
    state.getIn(['comments'], []).concat(comment)
  )
  .setIn(['createCommentStatus', 'creating'], false)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_COMMENTS_REQUEST]: getCommentsRequest,
  [Types.GET_COMMENTS_SUCCESS]: getCommentsSuccess,
  [Types.COMMENTS_REQUEST_FAILURE]: commentRequestFailure,
  [Types.CREATE_COMMENT_REQUEST]: createCommentRequest,
  [Types.CREATE_COMMENT_SUCCESS]: createCommentSuccess,
})
