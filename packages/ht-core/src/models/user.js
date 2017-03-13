import crypto from 'crypto'
import mongoose, {Schema} from 'mongoose'
import mongooseHidden from 'mongoose-hidden'

import encryptPassword from '../utils/encryptPassword'

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  emailIsVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    hideJSON: true
  },
  salt: {
    type: String
  },
  profile: {
    fullName: String
  },
  profileAvatar: {
      type: String
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.plugin(mongooseHidden())

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
