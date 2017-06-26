import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import { reducer as formReducer } from 'redux-form'
import entities from './Entities'
import {SessionTypes} from './SessionRedux'
import routes from './Routes'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const appReducer = combineReducers({
    login: require('./LoginRedux').reducer,
    signup: require('./SignupRedux').reducer,
    session: require('./SessionRedux').reducer,
    storyCreate: require('./StoryCreateRedux').reducer,
    form: formReducer,
    startup: require('./StartupRedux').reducer,
    orientation: require('./OrientationRedux').reducer,
    routes,
    entities,
  })

  const rootReducer = (state, action) => {
    // Allows us to reset store state completely
    // Used when we log out
    if (action.type === SessionTypes.RESET_ROOT_STORE) {
      state = undefined
    }

    return appReducer(state, action)
  }

  return configureStore(rootReducer, rootSaga)
}
