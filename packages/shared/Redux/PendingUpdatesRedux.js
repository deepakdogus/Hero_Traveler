import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addPendingUpdate: ['story', 'error', 'failedMethod'],
  removePendingUpdate: ['draftId'],
  setRetryingUpdate: ['storyId'],
  reset: null,
})

export const LocakDraftTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  // tracking both drafts and draftsById to keep addition order
  updateOrder: [],
  pendingUpdates: {},
})

export const addPendingUpdate = (state, {story, error, failedMethod}) => {
  const updateById = {
    [story.id]: {
      story: story,
      error,
      failedMethod,
      status: 'failed',
    }
  }
  state = state.merge({pendingUpdates: updateById}, {deep: true})

  let updateOrder = state.updateOrder
  if (updateOrder.indexOf(story.id) === -1) {
    updateOrder = [story.id, ...updateOrder]
  }
  return state.merge({ updateOrder })
}

// if local id removes from story entities if present
// removes from drafts.byId
export const removePendingUpdate = (state, {draftId}) => {
  state = state.setIn(['pendingUpdates'], state.pendingUpdates.without(draftId))
  const path = ['updateOrder']
  return state.setIn(path, state.getIn(path, draftId).filter(id => {
    return id !== draftId
  }))
}

export const setRetryingUpdate = (state, {storyId}) => {
  if (state.pendingUpdates[storyId]){
    return state.setIn(['pendingUpdates', storyId, 'status'], 'retrying')
  }
  return state
}

export const reset = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_PENDING_UPDATE]: addPendingUpdate,
  [Types.REMOVE_PENDING_UPDATE]: removePendingUpdate,
  [Types.SET_RETRYING_UPDATE]: setRetryingUpdate,
  [Types.RESET]: reset,
})
