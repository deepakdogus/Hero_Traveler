import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  registerDraft: null,
  registerDraftSuccess: ['draft'],
  registerDraftFailure: null,
  editStory: ['storyId'],
  editStorySuccess: ['story'],
  editStoryFailure: ['error'],
  publishDraft: ['draft'],
  publishDraftSuccess: ['draft'],
  publishDraftFailure: ['error'],
  discardDraft: ['draftId'],
  discardDraftSuccess: ['draft'],
  discardDraftFailure: ['error'],
  updateDraft: ['draftId', 'draft', 'updateStoryEntity'],
  updateDraftSuccess: ['draft'],
  updateDraftFailure: ['error'],
  uploadCoverImage: ['draftId', 'path'],
  uploadCoverImageSuccess: ['draft'],
  uploadCoverImageFailure: ['error'],
  updateCategories: ['categories'],
  resetCreateStore: null,
  toggleCreateModal: null
})

export const StoryCreateTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isShowCreateModal: false,
  draft: null,
  publishing: false,
  error: null,
  isPublished: false,
  fetchStatus: {
    loaded: false,
    fetching: false
  }
})

/* ------------- Reducers ------------- */
export const reset = () => INITIAL_STATE

export const toggleCreateModal = (state) => {
  return state.merge({
    isShowCreateModal: !state.isShowCreateModal,
  })
}

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
    draft: null
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

export const updateCategories = (state, {categories}) => {
  return state.setIn(['draft', 'categories'], categories)
}

export const editStory = (state) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    }
  })
}

export const editStorySuccess = (state, {story}) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    draft: story
  })
}

export const editStoryFailure = (state, {error}) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: false
    },
    error
  })
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
  [Types.UPDATE_CATEGORIES]: updateCategories,
  [Types.EDIT_STORY]: editStory,
  [Types.EDIT_STORY_SUCCESS]: editStorySuccess,
  [Types.EDIT_STORY_FAILURE]: editStoryFailure,
  [Types.RESET_CREATE_STORE]: reset,
  [Types.TOGGLE_CREATE_MODAL]: toggleCreateModal
})

export const hasDraft = (state) => !!_.get(state.draft, 'id')
export const isCreated = (state) => state.isPublished
export const isPublishing = (state) => state.publishing
export const getDraft = (state) => {
  return state.storyCreate.draft
}
