import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addRecentSearch: ['search']
})

const INITIAL_STATE = Immutable({
  searchHistory: {
    places: [],
    people: [],
    lastSearchType: '',
    navedToId: ''
  }
})

const MAX_RECENT_SEARCHES = 10

export const addRecentSearch = (state, action) => {
  const { id, searchType, title } = action.search
  const recentSearches = state.searchHistory[searchType]
  let updatedSearch = [
    action.search,
    ...recentSearches.filter(
      search => search.id !== id && search.title !== title
    )
  ]
  if (updatedSearch.length >= MAX_RECENT_SEARCHES) {
    updatedSearch = updatedSearch.slice(0, MAX_RECENT_SEARCHES)
  }

  return state.merge(
    {
      searchHistory: {
        [searchType]: updatedSearch,
        lastSearchType: searchType,
        navedToId: id
      }
    },
    {
      deep: true
    }
  )
}

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_RECENT_SEARCH]: addRecentSearch
})

export default Creators
