import apn from 'apn'
import path from 'path'
import _ from 'lodash'
import {Models} from '@rwoody/ht-core'
const sound = 'chime.caf'
const badge = 1

let certPath, keyPath

if (process.env.NODE_ENV === 'development') {
  certPath = path.resolve(path.join(__dirname, '../certificates/apn-cert.pem'))
  keyPath = path.resolve(path.join(__dirname, '../certificates/apn-key.pem'))
} else {
  certPath = path.resolve(path.join(__dirname, '../certificates/apn-prod-cert.pem'))
  keyPath = path.resolve(path.join(__dirname, '../certificates/apn-prod-key.pem'))
}

const apnProvider = new apn.Provider({
  cert: certPath,
  key: keyPath
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

export function commentNotification(devices, story, user) {
  const notification = new apn.Notification({
    alert: `${user.profile.fullName} commented on your story ${story.title}`,
    badge,
    sound,
    payload: {
      type: 'comment'
    }
  })

  return _send(notification, getDeviceIds(devices))
    .then(result => {
      console.log('comment notif result', result)
      return Promise.resolve()
    })
}

function _send(notification, devices) {
  return apnProvider.send(notification, devices)
    .then(result => {
      let promise
      if (result.failed.length) {
        promise = Models.UserDevice.remove({
          deviceId: {
            $in: _.map(result.failed, 'device')
          }
        })
      } else {
        promise = Promise.resolve()
      }

      return promise.then(() => Promise.resolve(result))
    })
}

export function cleanup() {
  console.log('cleaning up')
  apnProvider.shutdown()
}
