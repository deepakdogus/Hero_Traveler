import apn from 'apn'
import path from 'path'
import _ from 'lodash'

const sound = 'chime.caf'
const badge = 1

const apnProvider = new apn.Provider({
  cert: path.resolve(path.join(__dirname, '../certificates/apn-cert.pem')),
  key: path.resolve(path.join(__dirname, '../certificates/apn-key.pem'))
})

function getDeviceIds(devices) {
  return _.map(devices, 'deviceId')
}

export function likeNotification(devices, user, story) {
  const notification = new apn.Notification({
    alert: `${user.profile.fullName} liked your story ${story.title}`,
    badge,
    sound,
    payload: {
      type: 'like'
    }
  })
  return _send(notification, getDeviceIds(devices))
    .then(result => {
      console.log('like notif result', result)
      return Promise.resolve()
    })
}

export function followerNotification(devices, followingUser) {
  const notification = new apn.Notification({
    alert: `${followingUser.profile.fullName} is now following you`,
    badge,
    sound,
    payload: {
      type: 'follow'
    }
  })

  return _send(notification, getDeviceIds(devices))
    .then(result => {
      console.log('follow notif result', result)
      return Promise.resolve()
    })
}

function _send(notification, devices) {
  return apnProvider.send(notification, devices)
}

export function cleanup() {
  console.log('cleaning up')
  apnProvider.shutdown()
}
