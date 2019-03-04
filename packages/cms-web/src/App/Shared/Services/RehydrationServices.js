import ReduxPersist from '../../Config/ReduxPersist'
import debugConfig from '../../Config/DebugConfig'
import { persistStore } from 'redux-persist'
import StartupActions from '../Redux/StartupRedux'

const updateReducers = (store: Object) => {
  const reducerVersion = ReduxPersist.reducerVersion
  const config = ReduxPersist.storeConfig
  const startup = () => store.dispatch(StartupActions.startup())
  const AsyncStorage = ReduxPersist.storeConfig.storage
  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion').then((localVersion) => {
    if (localVersion !== reducerVersion) {
      if (debugConfig.useReactotron && console.tron) {
        console.tron.display({
          name: 'PURGE',
          value: {
            'Old Version:': localVersion,
            'New Version:': reducerVersion,
          },
          preview: 'Reducer Version Change Detected',
          important: true,
        })
      }
      // Purge store
      persistStore(store, config, startup).purge()
      AsyncStorage.setItem('reducerVersion', reducerVersion)
    }
 else {
      if (debugConfig.useReactotron && console.tron) {
        console.tron.display({
          messsage: 'Store',
          preview: 'Store!',
          value: {
            store: store.getState(),
          },
        })
      }
      persistStore(store, config, startup)
    }
  }).catch(() => {
    if (debugConfig.useReactotron && console.tron) console.tron.log('Caught something!')
    persistStore(store, config, startup)
    AsyncStorage.setItem('reducerVersion', reducerVersion)
  })
}

export default {updateReducers}
