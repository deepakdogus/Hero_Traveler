import {Models} from '@hero/ht-core'

export default function removeDevice(req, res) {
  const {deviceId} = req.params

  return Models.UserDevice.remove({
    deviceId
  })
}
