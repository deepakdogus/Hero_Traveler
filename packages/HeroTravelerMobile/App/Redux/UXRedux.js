import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setStoryListVisibleRow: ['row'],
  setStoryListVisibleRows: ['rows'],
})
export const StartupTypes = Types

const INITIAL_STATE = Immutable({
  storyListVisibleRow: 0,
  storyListVisibleRows: [],
})

export const setStoryListVisibleRow = (state, {row}) => state.merge({storyListVisibleRow: row})
export const setStoryListVisibleRows = (state, {rows}) => state.merge({storyListVisibleRows: rows})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_STORY_LIST_VISIBLE_ROW]: setStoryListVisibleRow,
  [Types.SET_STORY_LIST_VISIBLE_ROWS]: setStoryListVisibleRows,
})

export default Creators
