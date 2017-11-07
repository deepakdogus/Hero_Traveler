import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  uploadRequest: ['objectId', 'file', 'uploadType'],
  uploadSuccess: [],
  uploadFailure: ['error'],
})

export const MediaUploadTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: null,
  saving: false,
})

/* ------------- Reducers ------------- */
export const uploadRequest = (state, action) => state.merge({ saving: true })

export const uploadSuccess = (state) =>
  state.merge({saving: false, error: null})

export const uploadFailure = (state, { error }) =>
  state.merge({saving: false, error})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPLOAD_REQUEST]: uploadRequest,
  [Types.UPLOAD_SUCCESS]: uploadSuccess,
  [Types.UPLOAD_FAILURE]: uploadFailure,
})
