import apn from 'apn'
import path from 'path'
import _ from 'lodash'

const sound = 'chime.caf'
const badge = 1

const apnProvider = new apn.Provider({
  cert: path.resolve(path.join(__dirname, '../certificates/apn-cert.pem')),
  key: path.resolve(path.join(__dirname, '../certificates/apn-key.pem'))
})

// const user = '31510843c57c274c8888a785625a4bd8e4c2c69cbe252709cd2b2100bdc0acb9'
// let note = new apn.Notification({
//   alert: '2 Breaking news! I just send my first notification',
//   badge: 1,
//   sound: 'chime.caf'
// })
//
// note.topic = 'com.rehashstudio.herotraveler'
//
// console.log(`Sending: ${note.compile()} to ${user}`);
//
// apnProvider.send(note, user).then(result => {
//   console.log('result', result)
// })

export function likeNotification(devices, user, story) {
  const deviceIds = _.map(devices, 'deviceId')
  const notification = new apn.Notification({
    alert: `${user.profile.fullName} liked your story ${story.title}`,
    badge,
    sound,
  })
  return _send(notification, deviceIds)
    .then(result => {
      console.log('like notif result', result)
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
