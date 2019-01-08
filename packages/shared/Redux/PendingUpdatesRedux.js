import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addPendingUpdate: ['story', 'error', 'failedMethod', 'status'],
  removePendingUpdate: ['draftId'],
  setRetryingUpdate: ['storyId'],
  resetStatuses: null,
  reset: null,
  checkIfDeleted: ['usersDeletedStories'],
})

export const LocakDraftTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  // tracking both drafts and draftsById to keep addition order
  updateOrder: [],
  pendingUpdates: {},
})

export const addPendingUpdate = (state, {story, error, failedMethod, status}) => {
  const updateById = {
    [story.id]: {
      story: story,
      error,
      failedMethod,
      status,
    }
  }
  state = state.merge({pendingUpdates: updateById}, {deep: true})

  let updateOrder = state.updateOrder
  if (updateOrder.indexOf(story.id) === -1) {
    updateOrder = [story.id, ...updateOrder]
  }
  else if (status === 'failed') {
    // ensures we rotate through pending updates
    updateOrder = updateOrder.filter(id => {
      return id !== story.id
    })
    updateOrder = [...updateOrder, story.id]
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

export const resetStatuses = state => {
  const {updateOrder, pendingUpdates} = state
  return updateOrder.reduce((workingState, id) => {
    const pendingUpdate = pendingUpdates[id]
    if (pendingUpdate.status !== 'retrying') return workingState
    return workingState.setIn(['pendingUpdates', id, 'status'], 'failed')
  }, state)
}

// getting deleted stories so we can remove from pendingDrafts in case a DB
// draft got deleted on another device and we still have a pendingDraft locally
export const checkIfDeleted = (state, {usersDeletedStories = [ {} ] }) => {
  const {updateOrder, pendingUpdates} = state
  return usersDeletedStories.reduce((workingState, story) => {
    const id = story.id
    if (updateOrder.indexOf(id) === -1) return workingState
    return removePendingUpdate(state, {draftId: id})
  }, state)
}

export const reset = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_PENDING_UPDATE]: addPendingUpdate,
  [Types.REMOVE_PENDING_UPDATE]: removePendingUpdate,
  [Types.SET_RETRYING_UPDATE]: setRetryingUpdate,
  [Types.RESET]: reset,
  [Types.RESET_STATUSES]: resetStatuses,
  [Types.CHECK_IF_DELETED]: checkIfDeleted,
})
