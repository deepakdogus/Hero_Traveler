import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  registerDraft: null,
  registerDraftSuccess: ['draft'],
  registerDraftFailure: null,
  publishDraft: ['draft'],
  publishDraftSuccess: ['draft'],
  publishDraftFailure: ['error'],
  discardDraft: ['draftId'],
  discardDraftSuccess: ['draft'],
  discardDraftFailure: ['error'],
  updateDraft: ['draftId', 'draft'],
  updateDraftSuccess: ['draft'],
  updateDraftFailure: ['error'],
  uploadCoverImage: ['draftId', 'path'],
  uploadCoverImageSuccess: ['draft'],
  uploadCoverImageFailure: ['error']
})

export const StoryCreateTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  draft: null,
  publishing: false,
  error: null,
  isPublished: false
})

/* ------------- Reducers ------------- */
export const reset = () => INITIAL_STATE

export const publish = (state, { userId }) => {
  return state.merge({
    publishing: true, error: null
  })
}

export const publishSuccess = (state, {draft}) => {
  return state.merge({
    publishing: false,
    error: null,
    isPublished: true,
    draft
  }, {deep: true})
}

export const failure = (state, {error}) =>
  state.merge({
    publishing: false,
    error
  })

export const registerDraft = () => INITIAL_STATE

export const registerDraftSuccess = (state, {draft}) => {
  return state.merge({draft})
}

export const updateDraft = (state, {draft}) => {
  return state.merge({draft}, {deep: true})
}

export const uploadCoverImageSuccess = (state, {draft}) => {
  return state.merge({draft}, {deep: true})
}

export const uploadCoverImageFailure = (state, {draft}) => {
  return state
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PUBLISH_DRAFT]: publish,
  [Types.PUBLISH_DRAFT_SUCCESS]: publishSuccess,
  [Types.PUBLISH_DRAFT_FAILURE]: failure,
  [Types.DISCARD_DRAFT_SUCCESS]: reset,
  [Types.DISCARD_DRAFT_FAILURE]: failure,
  [Types.UPDATE_DRAFT_SUCCESS]: updateDraft,
  [Types.UPDATE_DRAFT_FAILURE]: failure,
  [Types.REGISTER_DRAFT]: registerDraft,
  [Types.REGISTER_DRAFT_SUCCESS]: registerDraftSuccess,
  [Types.REGISTER_DRAFT_FAILURE]: failure,
  [Types.UPLOAD_COVER_IMAGE_SUCCESS]: uploadCoverImageSuccess,
  [Types.UPLOAD_COVER_IMAGE_FAILURE]: uploadCoverImageFailure,
})

export const hasDraft = (state) => _.get(state.draft, 'id') ? true : false
export const isCreated = (state) => state.isPublished
export const isPublishing = (state) => state.publishing
export const getDraft = (state) => {
  return state.storyCreate.draft
}