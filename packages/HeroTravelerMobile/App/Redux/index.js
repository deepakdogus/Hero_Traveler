import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import { reducer as formReducer } from 'redux-form'

import entities from './Entities'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    login: require('./LoginRedux').reducer,
    signup: require('./SignupRedux').reducer,
    session: require('./SessionRedux').reducer,
    storyCreate: require('./StoryCreateRedux').reducer,
    form: formReducer,
    entities,
  })

  return configureStore(rootReducer, rootSaga)
}
