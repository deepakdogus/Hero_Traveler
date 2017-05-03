import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null,
  started: false,
  hideSplash: null,
})
export const StartupTypes = Types

const INITIAL_STATE = Immutable({
  splashShown: true
})

export const hideSplash = (state) => state.merge({
  splashShown: false
})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.HIDE_SPLASH]: hideSplash,
})

export default Creators
