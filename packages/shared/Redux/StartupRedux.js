import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null,
  startupStarted: null,
  hideSplash: null,
  heroStartup: ['deeplinkObject']
})
export const StartupTypes = Types

const INITIAL_STATE = Immutable({
  splashShown: true,
  started: false
})

export const hideSplash = (state) => state.merge({
  splashShown: false
})

export const markStarted = (state) => state.merge({started: true})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.HIDE_SPLASH]: hideSplash,
  [Types.STARTUP_STARTED]: markStarted
})

export default Creators
