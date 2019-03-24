import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux'
import { autoRehydrate, persistReducer } from 'redux-persist'
import Config from '../../Config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import RehydrationServices from '../Services/RehydrationServices'
import { createLogger } from 'redux-logger'
import ReduxPersist, { persistConfig } from '../../Config/ReduxPersist'
import {middleware as routerMiddleware} from '../../Redux/Routes'

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = []
  const enhancers = []

  /* ------------- Logger Middleware ------------- */
  if (Config.reduxLogging) {
    middleware.push(createLogger({ collapsed: true }))
  }

  /* ------------- Saga Middleware ------------- */

  // const sagaMonitor = process.env.NODE_ENV === 'development' ? console.tron.createSagaMonitor() : null
  // const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  const sagaMiddleware = createSagaMiddleware()
  middleware.push(sagaMiddleware)

  /* ------------- Navigation Middleware ------------- */
  // do we use this - look at history?
  if (routerMiddleware) {
    middleware.push(routerMiddleware)
  }

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware))

  /* ------------- AutoRehydrate Enhancer ------------- */

  // add the autoRehydrate enhancer
  if (!persistConfig && ReduxPersist.active) {
    enhancers.push(autoRehydrate())
  }

  // if Reactotron is enabled (default for process.env.NODE_ENV === 'development'), we'll create the store through Reactotron
  // const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore
  // const store = createAppropriateStore(rootReducer, compose(...enhancers))
  let reducerToUse = rootReducer
  if (persistConfig) {
    reducerToUse = persistReducer(persistConfig, rootReducer)
  }
  const store = createStore(reducerToUse, compose(...enhancers))

  // configure persistStore and check reducer version number
  if (!persistConfig && ReduxPersist.active) {
    RehydrationServices.updateReducers(store)
  }

  // kick off root saga
  sagaMiddleware.run(rootSaga)

  return store
}
