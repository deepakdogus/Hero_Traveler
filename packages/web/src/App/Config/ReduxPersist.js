import immutablePersistenceTransform from '../Shared/Services/ImmutablePersistenceTransform'
import { asyncLocalStorage } from 'redux-persist/storages'

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '12',
  storeConfig: {
    storage: asyncLocalStorage,
    // blacklist: ['login', 'search', 'feed'], // reducer keys that you do NOT want stored to persistence here
    whitelist: ['pendingUpdates', 'history'], // Optionally, just specify the keys you DO want stored to
    // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409
    transforms: [immutablePersistenceTransform],
  },
}

export default REDUX_PERSIST
