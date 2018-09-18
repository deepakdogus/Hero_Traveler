import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openGlobalModal: ['modalName', 'params'],
  updateGlobalModalParams: ['params'],
  closeGlobalModal: ['params'],
})

export const StartupTypes = Types

const INITIAL_STATE = Immutable({
  modalName: '',
  params: {}
})

export const openGlobalModal = (state, {modalName, params = {} }) => state.merge({modalName, params})

export const updateGlobalModalParams = (state, {params = {}}) => state.merge({params})

export const closeGlobalModal = (state, {params = {}}) => {
  return state.merge({
    modalName: '',
    params,
  })
}

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OPEN_GLOBAL_MODAL]: openGlobalModal,
  [Types.UPDATE_GLOBAL_MODAL_PARAMS]: updateGlobalModalParams,
  [Types.CLOSE_GLOBAL_MODAL]: closeGlobalModal,
})

export default Creators
