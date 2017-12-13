import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openModal: ['modalName'],
})
export const StartupTypes = Types

const INITIAL_STATE = Immutable({
  openModal: '',
})

export const openModal = (state, {modalName}) => state.merge({openModal: modalName})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OPEN_MODAL]: openModal
})

export default Creators
