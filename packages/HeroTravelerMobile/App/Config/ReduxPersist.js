import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage'
import { createTransform, PersistConfig } from 'redux-persist'
import Immutable from 'seamless-immutable'
import immutablePersistenceTransform from '../Shared/Services/ImmutablePersistenceTransform'

// const REDUX_PERSIST = {
//   active: true,
//   reducerVersion: '12',
//   storeConfig: {
//     storage: AsyncStorage,
//     // blacklist: ['login', 'search', 'feed'], // reducer keys that you do NOT want stored to persistence here
//     whitelist: ['session', 'entities', 'history', 'pendingUpdates'], // Optionally, just specify the keys you DO want stored to
//     // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409
//     transforms: [immutablePersistenceTransform],
//   },
// }

const transform = createTransform(
  // transform state on its way to being serialized and persisted.
  // inboundState should be an immutable object
  (inboundState, key) => {
    if (_.has(inboundState, 'asMutable')) {
      return inboundState.asMutable({ deep: true })
    }
    return inboundState
  },
  // transform state being rehydrated
  // outboundState should be a raw object
  (outboundState, key) => {
    return Immutable(outboundState)
  },
)

export const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  transforms: [transform],
  migrate: state => {
    if (_.get(state, '_persist.version') === version) {
      return Promise.resolve(state)
    }
    return Promise.resolve({
      _persist: state._persist,
    })
  },
}

// export default REDUX_PERSIST
