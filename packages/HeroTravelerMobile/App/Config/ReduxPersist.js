import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage'
import { createTransform, PersistConfig } from 'redux-persist'
import Immutable from 'seamless-immutable'

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

const version = 1

export const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version,
  transforms: [transform],
  whitelist: ['session', 'entities', 'history', 'pendingUpdates'],
  migrate: state => {
    if (_.get(state, '_persist.version') === version) {
      return Promise.resolve(state)
    }
    return Promise.resolve({
      _persist: state._persist,
    })
  },
}
