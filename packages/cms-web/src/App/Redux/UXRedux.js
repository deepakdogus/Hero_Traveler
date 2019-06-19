import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openGlobalModal: ['modalName', 'params'],
  updateGlobalModalParams: ['params'],
  closeGlobalModal: [''],
  closeGlobalModalWithParams: ['params'],
  addRecentSearch: ['searchType', 'searchText', 'id'],
})

export const StartupTypes = Types

const INITIAL_STATE = Immutable({
  modalName: '',
  params: {},
  searchHistory: {
    user: [],
    story: [],
    lastSearchType: '',
    navedToId: '',
  },
})

export const openGlobalModal = (state, {modalName, params = {} }) =>
  state.merge({modalName, params})

export const updateGlobalModalParams = (state, {params = {}}) => state.merge({params})

export const closeGlobalModal = (state) => state.merge({modalName: '', params: {}})

export const closeGlobalModalWithParams = (state, {params = {}}) => {
  return state.merge({
    modalName: '',
    params,
  })
}

export const addRecentSearch = (state, {searchType, searchText, id}) => {
  const recentSearches = state.searchHistory[searchType]
  let updatedSearch = recentSearches
  const searchTextIndex = recentSearches.indexOf(searchText)
  if (searchTextIndex === -1) {
    if (recentSearches.length === 5) {
      updatedSearch = [searchText, ...recentSearches.slice(0, 4)]
    }
    else {
      updatedSearch = [searchText, ...recentSearches]
    }
  }
  else if (searchTextIndex !== 0) {
    updatedSearch = [
      searchText,
      ...recentSearches.slice(0, searchTextIndex),
      ...recentSearches.slice(searchTextIndex + 1),
    ]
  }

  return state.merge({
    searchHistory: {
      [searchType]: updatedSearch,
      lastSearchType: searchType,
      navedToId: id,
    },
  }, {
    deep: true,
  })
}

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OPEN_GLOBAL_MODAL]: openGlobalModal,
  [Types.UPDATE_GLOBAL_MODAL_PARAMS]: updateGlobalModalParams,
  [Types.CLOSE_GLOBAL_MODAL]: closeGlobalModal,
  [Types.CLOSE_GLOBAL_MODAL_WITH_PARAMS]: closeGlobalModalWithParams,
  [Types.ADD_RECENT_SEARCH]: addRecentSearch,
})

export default Creators
