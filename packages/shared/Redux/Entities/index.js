import { combineReducers } from 'redux'

export default combineReducers({
  hashtags: require('./Hashtags').reducer,
  categories: require('./Categories').reducer,
  stories: require('./Stories').reducer,
  users: require('./Users').reducer,
  guides: require('./Guides').reducer,
  comments: require('./Comments').reducer,
})
