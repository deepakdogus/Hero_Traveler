import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setStoryListPlayingRow: ['row'],
  setStoryListVisibleRows: ['rows'],
})
export const StartupTypes = Types

const INITIAL_STATE = Immutable({
  storyListPlayingRow: 0,
  storyListVisibleRows: [],
})

export const setStoryListPlayingRow = (state, {row}) => state.merge({storyListPlayingRow: row})
export const setStoryListVisibleRows = (state, {rows}) => state.merge({storyListVisibleRows: rows})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_STORY_LIST_PLAYING_ROW]: setStoryListPlayingRow,
  [Types.SET_STORY_LIST_VISIBLE_ROWS]: setStoryListVisibleRows,
})

export default Creators
