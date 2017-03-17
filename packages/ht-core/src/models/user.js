import crypto from 'crypto'
import mongoose, {Schema} from 'mongoose'
import mongooseHidden from './mongooseHidden'

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
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    hideJSON: true
  },
  profile: {
    fullName: String,
    avatar: String
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

UserSchema.plugin(mongooseHidden)

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
