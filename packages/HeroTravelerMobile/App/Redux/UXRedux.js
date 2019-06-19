import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openGlobalModal: ['modalName', 'params'],
  closeGlobalModal: [],
})

export const StartupTypes = Types

const INITIAL_STATE = Immutable({
  modalName: '',
  params: {},
})

export const openGlobalModal = (state, {modalName, params}) => state.merge({modalName, params})

export const closeGlobalModal = (state) => state.merge({modalName: '', params: {}})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OPEN_GLOBAL_MODAL]: openGlobalModal,
  [Types.CLOSE_GLOBAL_MODAL]: closeGlobalModal,
})

export default Creators
