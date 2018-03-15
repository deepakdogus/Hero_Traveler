import { combineReducers } from 'redux'

export default combineReducers({
  categories: require('./Categories').reducer,
  stories: require('./Stories').reducer,
  users: require('./Users').reducer,
  storyComments: require('./StoryComments').reducer,
  guides: require('./Guides').reducer,
})
