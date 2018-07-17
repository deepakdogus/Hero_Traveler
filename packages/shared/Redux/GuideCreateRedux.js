import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  registerDraft: null,
  registerDraftSuccess: ['draft'],
  registerDraftFailure: ['error'],
  editGuide: ['guideId', 'cachedGuide'],
  editGuideSuccess: ['guide'],
  editGuideFailure: ['error', 'cachedGuide'],
  publishLocalGuide: ['draft'],
  publishDraft: ['draft'],
  publishDraftSuccess: ['draft'],
  publishDraftFailure: ['error'],
  discardDraft: ['draftId'],
  discardDraftSuccess: ['draft'],
  discardDraftFailure: ['error'],
  updateDraft: ['draftId', 'draft', 'updateGuideEntity'],
  updateWorkingDraft: ['workingDraft'],
  updateDraftSuccess: ['draft'],
  updateDraftFailure: ['error'],
  uploadCoverImage: ['draftId', 'path'],
  uploadCoverImageSuccess: ['draft'],
  uploadCoverImageFailure: ['error'],
  resetCreateStore: null,
  initializeSyncProgress: ['numSteps', 'message'],
  incrementSyncProgress: ['steps'],
  syncError: null,
  resetSync: null
})

export const GuideCreateTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  draft: null,
  workingDraft: null,
  sync: {
    syncProgress: 0,
    syncProgressSteps: 0,
    message: '',
    error: false,
  },
  error: null,
  fetchStatus: {
    loaded: false,
    fetching: false
  }
})

/* ------------- Reducers ------------- */
export const reset = () => INITIAL_STATE

export const publish = (state, { userId }) => state.merge({ error: null })

export const publishSuccess = (state, {draft}) => {
  return state.merge({
    error: null,
    draft: null,
    sync: {
      syncProgress: state.sync.syncProgressSteps
    }
  }, {deep: true})
}

export const failure = (state, {error}) => state.merge({ error })

export const failureUpdating = (state, {error}) => {
  return state.merge({
    error,
    sync: {
      error: true
    }
  })

}

export const registerDraft = () => INITIAL_STATE

export const registerDraftSuccess = (state, {draft}) => {
  return state.merge({
    draft,
    workingDraft: draft,
    error: null,
  })
}

// updateDraft called after save. Making sure to sync up workingDraft + draft
export const updateDraftSuccess = (state, {draft}) => {
  state = state.setIn(['sync', 'syncProgress'], state.sync.syncProgressSteps)
  return state.merge({
    draft,
    workingDraft: draft,
  },
  {deep: true})
}

// updateWorkingDraft only updates local draft
export const updateWorkingDraft = (state, {workingDraft}) => {
  return state.merge({workingDraft}, {deep: true})
}

export const uploadCoverImageSuccess = (state, {draft}) => {
  return state.merge({draft}, {deep: true})
}

export const uploadCoverImageFailure = (state, {draft}) => {
  return state
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

export const incrementSyncProgress = (state, {steps = 1}) => {
  return state.setIn(['sync', 'syncProgress'], state.sync.syncProgress + steps)
}

export const syncError = (state) => {
  return state.setIn(['sync', 'error'], true)
}

export const resetSync = (state) => {
  return state.merge({
    sync: {
      syncProgress: 0,
      syncProgressSteps: 0,
      message: '',
      error: false,
    }
  })
}

export const editGuide = (state) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: true
    }
  })
}

export const editGuideSuccess = (state, {guide}) => {
  return state.merge({
    fetchStatus: {
      loaded: true,
      fetching: false
    },
    draft: guide,
    workingDraft: guide,
    error: false,
  })
}

export const editGuideFailure = (state, {error, cachedGuide}) => {
  return state.merge({
    fetchStatus: {
      loaded: false,
      fetching: false
    },
    error,
    draft: cachedGuide,
    workingDraft: cachedGuide,
  })
}



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PUBLISH_DRAFT]: publish,
  [Types.PUBLISH_LOCAL_DRAFT]: publish,
  [Types.PUBLISH_DRAFT_SUCCESS]: publishSuccess,
  [Types.PUBLISH_DRAFT_FAILURE]: failure,
  [Types.DISCARD_DRAFT_SUCCESS]: reset,
  [Types.DISCARD_DRAFT_FAILURE]: failure,
  [Types.UPDATE_WORKING_DRAFT]: updateWorkingDraft,
  [Types.UPDATE_DRAFT_SUCCESS]: updateDraftSuccess,
  [Types.UPDATE_DRAFT_FAILURE]: failureUpdating,
  [Types.REGISTER_DRAFT]: registerDraft,
  [Types.REGISTER_DRAFT_SUCCESS]: registerDraftSuccess,
  [Types.REGISTER_DRAFT_FAILURE]: failure,
  [Types.UPLOAD_COVER_IMAGE_SUCCESS]: uploadCoverImageSuccess,
  [Types.UPLOAD_COVER_IMAGE_FAILURE]: uploadCoverImageFailure,
  [Types.EDIT_GUIDE]: editGuide,
  [Types.EDIT_GUIDE_SUCCESS]: editGuideSuccess,
  [Types.EDIT_GUIDE_FAILURE]: editGuideFailure,
  [Types.RESET_CREATE_STORE]: reset,
  [Types.INITIALIZE_SYNC_PROGRESS]: initializeSyncProgress,
  [Types.INCREMENT_SYNC_PROGRESS]: incrementSyncProgress,
  [Types.SYNC_ERROR]: syncError,
  [Types.RESET_SYNC]: resetSync,
})
