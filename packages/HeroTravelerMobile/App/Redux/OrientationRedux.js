import { createReducer, createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  setOrientation: (event) => {
    const { width, height } = event
    const orientation = (width > height) ? 'landscape' : 'portrait'
    return { type: 'SET_ORIENTATION', orientation }
  }
})

export const OrientationTypes = Types
export default Creators

export const INITIAL_STATE = 'portrait'


/* ------------- Reducer ------------- */

export const setOrientation = (state, { orientation }) => {
  return orientation
}

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_ORIENTATION]: setOrientation
})
