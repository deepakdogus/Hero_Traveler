import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import findIndex from 'lodash/findIndex'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetUsers: ['params'],
  adminGetUsersSuccess: ['res'],
  adminGetUsersFailure: ['error'],
  adminGetUser: ['id'],
  adminGetUserSuccess: ['res'],
  adminGetUserFailure: ['error'],
  adminGetCategories: ['params'],
  adminGetCategoriesSuccess: ['res'],
  adminGetCategoriesFailure: ['error'],
  adminGetStories: ['params'],
  adminGetStoriesSuccess: ['res'],
  adminGetStoriesFailure: ['error'],
})

export const AdminTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  users: {
    isLoading: false,
    list: [],
    total: 0,
    error: null,
    params: {
      page: 1,
      limit: 5
    }
  },
  categories: {
    isLoading: false,
    list: [],
    total: 0,
    error: null,
    params: {
      page: 1,
      limit: 5
    }
  },
  stories: {
    isLoading: false,
    list: [],
    total: 0,
    error: null,
    params: {
      page: 1,
      limit: 5
    }
  }
})

/* ------------- Reducers ------------- */
export const adminGetUsers = (state, { params = {} }) => {
  return state.merge({
    users: {
      isLoading: true,
      params: {
        ...state.users.params,
        ...params
      }
    }
  }, {
    deep: true
  })
}

export const adminGetUsersFailure = (state, { error }) => {
  return state.merge({
    users: {
      error,
      isLoading: false
    }
  })
}

export const adminGetUsersSuccess = (state, { res }) => {
  return state.merge({
    users: {
      ...state.users,
      list: res.data,
      total: res.count,
      isLoading: false,
      error: null
    }
  },
  {
    deep: true
  })
}

export const adminGetUser = (state, { params = {} }) => {
  return state.setIn(['users', 'isLoading'], true)
}

export const adminGetUserFailure = (state, { error }) => {
  return state.merge({
    users: {
      error,
      isLoading: false
    }
  })
}

export const adminGetUserSuccess = (state, { res }) => {
  let list = [...state.getIn(['users', 'list'])]
  let total = state.getIn(['users', 'total'])
  const userIndex = findIndex(list, { id: res.id })
  console.log('userIndex', list, userIndex)
  if (userIndex >= 0) {
    list[userIndex] = res.record
  } else {
    list.push(res.record)
    total = total + 1
  }
  return state.merge({
    users: {
      ...state.users,
      list,
      total,
      isLoading: false,
      error: null
    }
  },
  {
    deep: true
  })
}

export const adminGetCategories = (state, { params = {} }) => {
  return state.merge({
    categories: {
      isLoading: true,
      params: {
        ...state.categories.params,
        ...params
      }
    }
  }, {
    deep: true
  })
}

export const adminGetCategoriesFailure = (state, { error }) => {
  return state.merge({
    categories: {
      error,
      isLoading: false
    }
  })
}

export const adminGetCategoriesSuccess = (state, { res }) => {
  return state.merge({
    categories: {
      ...state.categories,
      list: res.data,
      total: res.count,
      isLoading: false,
      error: null
    }
  },
  {
    deep: true
  })
}

export const adminGetStories = (state, { params = {} }) => {
  return state.merge({
    stories: {
      isLoading: true,
      params: {
        ...state.stories.params,
        ...params
      }
    }
  }, {
    deep: true
  })
}

export const adminGetStoriesFailure = (state, { error }) => {
  return state.merge({
    stories: {
      error,
      isLoading: false
    }
  })
}

export const adminGetStoriesSuccess = (state, { res }) => {
  return state.merge({
    stories: {
      ...state.stories,
      list: res.data,
      total: res.count,
      isLoading: false,
      error: null
    }
  },
  {
    deep: true
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_USERS]: adminGetUsers,
  [Types.ADMIN_GET_USERS_FAILURE]: adminGetUsersFailure,
  [Types.ADMIN_GET_USERS_SUCCESS]: adminGetUsersSuccess,
  [Types.ADMIN_GET_USER]: adminGetUser,
  [Types.ADMIN_GET_USER_FAILURE]: adminGetUserFailure,
  [Types.ADMIN_GET_USER_SUCCESS]: adminGetUserSuccess,
  [Types.ADMIN_GET_CATEGORIES]: adminGetCategories,
  [Types.ADMIN_GET_CATEGORIES_FAILURE]: adminGetCategoriesFailure,
  [Types.ADMIN_GET_CATEGORIES_SUCCESS]: adminGetCategoriesSuccess,
  [Types.ADMIN_GET_STORIES]: adminGetStories,
  [Types.ADMIN_GET_STORIES_FAILURE]: adminGetStoriesFailure,
  [Types.ADMIN_GET_STORIES_SUCCESS]: adminGetStoriesSuccess,
})

/* ------------- Selectors ------------- */

