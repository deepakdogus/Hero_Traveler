import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  feedRequest: ['userId'],
  feedSuccess: ['stories'],
  feedFailure: null,
  fromUserRequest: ['userId'],
  fromUserSuccess: ['stories'],
  fromUserFailure: null,
  receiveStories: ['stories']
})

export const StoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  entities: {},
  fetchStatus: {
    fetching: false,
    loaded: false,
  },
  error: null,
})

/* ------------- Reducers ------------- */

// request the temperature for a city
export const request = (state, { userId }) => {
  return Immutable.setIn(
    state,
    ['fetchStatus', 'fetching'],
    true
  );
}
// successful temperature lookup
export const receive = (state, action) => {
  const { stories } = action;
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    entities: stories
  })
}

// failed to get the temperature
export const failure = (state) =>
  state.merge({
    fetchStatus: {
      fetching: false
    },
    error: 'Failed to get stories'
  }, {
    deep: true
  })


/* ------------- Selectors ------------- */

export const getByCategory = (storyEntities, categoryId) => {
  return _.filter(storyEntities, s => {
    return s.category === categoryId
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FEED_REQUEST]: request,
  [Types.FEED_SUCCESS]: receive,
  [Types.FEED_FAILURE]: failure,
  [Types.FROM_USER_REQUEST]: request,
  [Types.FROM_USER_SUCCESS]: receive,
  [Types.FROM_USER_FAILURE]: failure,
  [Types.RECEIVE_STORIES]: receive,
})
