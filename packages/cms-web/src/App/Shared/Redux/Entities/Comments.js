import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
	getCommentsRequest: ['feedItemId', 'entityType'],
	getCommentsSuccess: ['comments', 'feedItemId', 'entityType'],
  commentRequestFailure: ['error', 'request'],
  createCommentRequest: ['feedItemId', 'entityType', 'text'],
  createCommentSuccess: ['comment', 'feedItemId', 'entityType'],
})

export const CommentTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	guide: {},
	story: {},
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
    },
  })
}

export const getCommentsSuccess = (state, {comments = [], feedItemId, entityType}) => {
	const update = {
		story:{},
		guide:{},
		fetchStatus: {
			fetching: false,
			loaded: true,
		},
		error: null,
	}
	update[entityType][feedItemId] = comments

	return state.merge(
		update,
		{ deep: true },
	)
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
    },
  })
}

export const createCommentSuccess = (state, {comment, feedItemId, entityType}) => {
	return state.setIn(
		[entityType, feedItemId],
		state.getIn([entityType, feedItemId], []).concat(comment),
	)
	.setIn(['createCommentStatus', 'creating'], false)
}

export const reducer = createReducer(INITIAL_STATE, {
	[Types.GET_COMMENTS_REQUEST]: getCommentsRequest,
  [Types.GET_COMMENTS_SUCCESS]: getCommentsSuccess,
  [Types.COMMENTS_REQUEST_FAILURE]: commentRequestFailure,
  [Types.CREATE_COMMENT_REQUEST]: createCommentRequest,
  [Types.CREATE_COMMENT_SUCCESS]: createCommentSuccess,
})
