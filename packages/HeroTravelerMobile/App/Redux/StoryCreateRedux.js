import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  registerDraft: null,
  registerDraftSuccess: ['draft'],
  registerDraftFailure: null,
  publishDraft: null,
  publishDraftSuccess: null,
  publishDraftFailure: ['error'],
  discardDraft: ['draftId'],
  discardDraftSuccess: ['draft'],
  discardDraftFailure: ['error'],
  updateDraft: ['draft'],
  updateDraftSuccess: ['draft'],
  updateDraftFailure: ['error'],
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

export const request = (state, { userId }) => {
  return state.merge({publishing: true, error: null});
}

export const success = (state, {draft}) => {
  return state.merge({
    publishing: false,
    error: null,
    isPublished: true,
    draft
  })
}

export const failure = (state, {error}) =>
  state.merge({
    publishing: false,
    error
  })

export const registerDraftSuccess = (state, {draft}) => {
  return state.merge({draft})
}

export const updateDraft = (state, {draft}) => {
  return state.merge({draft}, {deep: true})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PUBLISH_DRAFT]: request,
  [Types.PUBLISH_DRAFT_SUCCESS]: success,
  [Types.PUBLISH_DRAFT_FAILURE]: failure,
  [Types.DISCARD_DRAFT_SUCCESS]: reset,
  [Types.DISCARD_DRAFT_FAILURE]: failure,
  [Types.UPDATE_DRAFT_SUCCESS]: updateDraft,
  [Types.UPDATE_DRAFT_FAILURE]: failure,
  [Types.REGISTER_DRAFT_SUCCESS]: registerDraftSuccess,
  [Types.REGISTER_DRAFT_FAILURE]: failure,
})

export const hasDraft = (state) => _.get(state.draft, 'id') ? true : false
export const DISCARDed = (state) => state.isPublished
