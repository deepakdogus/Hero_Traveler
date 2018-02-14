import ReduxPersist from '../Config/ReduxPersist'
import { AsyncStorage } from 'react-native'
import { persistStore } from 'redux-persist'
import StartupActions from '../Shared/Redux/StartupRedux'

const updateReducers = (store: Object) => {
  const reducerVersion = ReduxPersist.reducerVersion
  const config = ReduxPersist.storeConfig
  const startup = () => store.dispatch(StartupActions.startup())
  console.log("inside of updateReducers", store)
  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion').then((localVersion) => {
    console.log("inside reducerVersion success", localVersion)
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
      AsyncStorage.setItem('reducerVersion', reducerVersion)
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
    console.log("inside reducerVersion fail")
    console.tron.log('Caught something!')
    persistStore(store, config, startup)
    AsyncStorage.setItem('reducerVersion', reducerVersion)
  })
}

export default {updateReducers}
