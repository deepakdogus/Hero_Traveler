import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import { reducer as formReducer } from 'redux-form'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    github: require('./GithubRedux').reducer,
    login: require('./LoginRedux').reducer,
    search: require('./SearchRedux').reducer,
    feed: require('./StoryRedux').reducer,
    signup: require('./SignupRedux').reducer,
    session: require('./SessionRedux').reducer,
    storyCreate: require('./StoryCreateRedux').reducer,
    categories: require('./CategoryRedux').reducer,
    form: formReducer,
  })

  return configureStore(rootReducer, rootSaga)
}
