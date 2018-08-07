import { createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators} = createActions({
  getGuidesCommentsRequest: ['guideId'],
  getGuidesCommentsSuccess: ['comments'],
  commentGuidesRequestFailure: ['error', 'request'],
  createGuidesCommentRequest: ['guideId', 'text'],
  createGuidesCommentSuccess: ['comment'],
})

export const GuideCommentsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  comments: [],
  getCommentsStatus: {
    fetching: false,
    loaded: false
  },
    createCommentStatus: {
    creating: false,
  },
  error: null,
})

/* ------------- Reducers ------------- */

export const getGuidesCommentsRequest = (state) => {
  return state.merge({
    getCommentsStatus: {
      fetching: true,
        loaded: false
      }
  })
}


export const getGuidesCommentsSuccess = (state, {comments = []}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true
    },
    error: null,
    comments
  }), {
    deep: true
  }
}

export const commentGuidesRequestFailure = (state, {error, request}) => {
  let update = {error}
  if(request === 'get') update.getCommentsStatus = {
    fetching: false,
    loaded: false
  }
  else if (request === 'create') update.createCommentStatus = {creating: false}
  return state.merge(update)
}

export const createGuidesCommentRequest = (state) => {
  return state.merge({
    createCommentStatus: {
      creating: true,
    }
  })
}

export const createGuidesCommentSuccess = (state, {comment}) => {
  return state.setIn(
    ['comments'],
    state.getIn(['comments'], []).concat(comment)
  )
  .setIn('createCommentStatus', 'creating', false)
}

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_GUIDES_COMMENTS_REQUEST]: getGuidesCommentsRequest,
  [Types.GET_GUIDES_COMMENTS_SUCCESS]: getGuidesCommentsSuccess,
  [Types.COMMENTS_GUIDES_REQUEST_FAILURE]: commentGuidesRequestFailure,
  [Types.CREATE_GUIDES_COMMENT_REQUEST]: createGuidesCommentRequest,
  [Types.CREATE_GUIDES_COMMENT_SUCCESS]: createGuidesCommentSuccess,
})