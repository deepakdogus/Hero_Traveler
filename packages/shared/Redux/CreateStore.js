import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux'
import { autoRehydrate } from 'redux-persist'
import Config from '../../Config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import RehydrationServices from '../Services/RehydrationServices'
import CreateLogger from 'redux-logger'
import ReduxPersist from '../../Config/ReduxPersist'
import {middleware as routerMiddleware} from '../../Redux/Routes'

// creates the store
export default (rootReducer, rootSaga) => {
  // /* ------------- Redux Configuration ------------- */

  const middleware = []
  const enhancers = []

  // /* ------------- Saga Middleware ------------- */

  // const sagaMonitor = process.env.NODE_ENV === 'development' ? console.tron.createSagaMonitor() : null
  // const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  // middleware.push(sagaMiddleware)

  if (Config.reduxLogging) {
    middleware.push(CreateLogger({collapsed: true}))
  }

  // /* ------------- Navigation Middleware ------------- */
  // do we use this - look at history?
  if (routerMiddleware) {
    middleware.push(routerMiddleware)
  }

  // /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware))

  // /* ------------- AutoRehydrate Enhancer ------------- */

  // // add the autoRehydrate enhancer
  if (ReduxPersist.active) {
    enhancers.push(autoRehydrate())
  }

  // // if Reactotron is enabled (default for process.env.NODE_ENV === 'development'), we'll create the store through Reactotron
  // const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore
  // const store = createAppropriateStore(rootReducer, compose(...enhancers))
  const store = createStore(rootReducer, compose(...enhancers))

  // // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    console.log("rehydrating")
    RehydrationServices.updateReducers(store)
  }

  // // kick off root saga
  // sagaMiddleware.run(rootSaga)

  return store
}
