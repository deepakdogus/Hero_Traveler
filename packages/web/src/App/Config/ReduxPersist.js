// import immutablePersistenceTransform from '../Shared/Services/ImmutablePersistenceTransform'
// import { AsyncStorage } from 'react-native'

// HAS NOT BEEN SET UP FOR WEB - WHY ACTIVE IS SET TO FALSE
const REDUX_PERSIST = {
  active: false,
  reducerVersion: '8',
  storeConfig: {
    // storage: AsyncStorage,
    // blacklist: ['login', 'search', 'feed'], // reducer keys that you do NOT want stored to persistence here
    whitelist: ['session'], // Optionally, just specify the keys you DO want stored to
    // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409
    // transforms: [immutablePersistenceTransform]
  }
}

export default REDUX_PERSIST
