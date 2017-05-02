import {Models} from '@rwoody/ht-core'

export default function updateDevice(req, res) {
  const {device} = req.body
  const {user} = req

  if (!device) {
    return Promise.resolve()
  }

  return Models.UserDevice.findOneAndUpdate({
    deviceId: device.token,
  }, {
    $set: {
      user: user._id,
      os: device.os
    }
  }, {
    setDefaultsOnInsert: true,
    upsert: true,
    new: true
  })
}
