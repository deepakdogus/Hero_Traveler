import _ from 'lodash'
import crypto from 'crypto'
import mongoose, {Schema} from 'mongoose'
import {Constants} from '@rwoody/ht-util'

import mongooseHidden from './plugins/mongooseHidden'
import encryptPassword from '../utils/encryptPassword'

export const ModelName = 'User'

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
  counts: {
    followers: {
      type: Number,
      default: 0
    },
    following: {
      type: Number,
      default: 0
    }
  },
  role: {
    type: String,
    enum: [
      Constants.USER_ROLES_USER_VALUE,
      Constants.USER_ROLES_ADMIN_VALUE,
      Constants.USER_ROLES_BRAND_VALUE,
      Constants.USER_ROLES_CONTRIBUTOR_VALUE,
    ],
    default: Constants.USER_ROLES_USER_VALUE
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

export default mongoose.model(ModelName, UserSchema)
