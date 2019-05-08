import { combineReducers } from 'redux'

export default combineReducers({
  stats: require('./Stats').reducer,
})
