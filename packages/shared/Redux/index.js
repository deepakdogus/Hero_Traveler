import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import { reducer as formReducer } from 'redux-form'
import entities from './Entities'
import {SessionTypes} from './SessionRedux'
// related to nav which is device specific so not located in shared folder
import routes from '../../Redux/Routes'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const appReducer = combineReducers({
    login: require('./LoginRedux').reducer,
    signup: require('./SignupRedux').reducer,
    session: require('./SessionRedux').reducer,
    storyCreate: require('./StoryCreateRedux').reducer,
    form: formReducer,
    startup: require('./StartupRedux').reducer,
    mediaUpload: require('./MediaUploadRedux').reducer,
    routes,
    entities,
    pendingUpdates: require('./PendingUpdatesRedux').reducer,
    ux: require('../../Redux/UXRedux').reducer,
    history: require('./HistoryRedux').reducer,
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
