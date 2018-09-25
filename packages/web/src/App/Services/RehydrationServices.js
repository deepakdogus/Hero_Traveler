import ReduxPersist from '../Config/ReduxPersist'
import { persistStore } from 'redux-persist'
import StartupActions from '../Shared/Redux/StartupRedux'
import { asyncLocalStorage } from "redux-persist/storages"

const updateReducers = (store: Object) => {
  const reducerVersion = ReduxPersist.reducerVersion
  const config = ReduxPersist.storeConfig
  const startup = () => store.dispatch(StartupActions.startup())

  // Check to ensure latest reducer version
  asyncLocalStorage.getItem('reducerVersion').then((localVersion) => {
    if (localVersion !== reducerVersion) {
      console.tron.display({
        name: 'PURGE',
        value: {
          'Old Version:': localVersion,
          'New Version:': reducerVersion
        },
        preview: 'Reducer Version Change Detected',
        important: true
      })
      // Purge store
      persistStore(store, config, startup).purge()
      asyncLocalStorage.setItem('reducerVersion', reducerVersion)
    } else {
      console.tron.display({
        messsage: 'Store',
        preview: 'Store!',
        value: {
          store: store.getState()
        }
      })
      persistStore(store, config, startup)
    }
  }).catch(() => {
    console.tron.log('Caught something!')
    persistStore(store, config, startup)
    asyncLocalStorage.setItem('reducerVersion', reducerVersion)
  })
}

export default {updateReducers}
