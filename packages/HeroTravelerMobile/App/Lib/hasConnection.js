import { NetInfo, Platform } from 'react-native'

const getConnectionInfo = async () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      const connectionHandler = connectionInfo => {
        NetInfo.removeEventListener('connectionChange', connectionHandler)

        resolve(connectionInfo)
      }

      NetInfo.addEventListener('connectionChange', connectionHandler)
    })
  }

  return NetInfo.getConnectionInfo()
}

export default function hasConnection() {
  return getConnectionInfo()
  .then(({ type }) => {
    return type !== 'none' && type !== 'unknown'
  })
  .catch(() => false)
}
