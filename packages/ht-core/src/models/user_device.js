import mongoose, {Schema} from 'mongoose'
import {Constants} from '@rwoody/ht-util'
import {UserRef} from './user'

export const ModelName = 'UserDevice'

const UserDeviceSchema = Schema({
  deviceId: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  os: {
    type: String,
    enum: [
      Constants.DEVICE_TYPE_IOS
    ]
  }
}, {
  timestamps: true
})

UserDeviceSchema.statics = {
  addOrUpdate({token, os}, userId) {
    return this.findOneAndUpdate({
      deviceId: token
    }, {
      user: userId,
      os
    }, {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    })
  }
}

export default mongoose.model(ModelName, UserDeviceSchema)
