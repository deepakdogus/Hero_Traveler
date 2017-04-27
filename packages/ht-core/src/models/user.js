import _ from 'lodash'
import randToken from 'rand-token'
import uuid from 'uuid'
import mongoose, {Schema} from 'mongoose'
import softDelete from 'mongoose-delete'
import uniqueValidator from 'mongoose-unique-validator'
import {Constants} from '@rwoody/ht-util'

import CoreError from '../utils/error'
import {ModelName as UploadRef} from './upload'
import mongooseHidden from './plugins/mongooseHidden'
import encryptPassword from '../utils/encryptPassword'

export const ACCOUNT_TYPE_FACEBOOK = 'facebook'
export const ACCOUNT_TYPE_TWITTER  = 'twitter'
export const ACCOUNT_TYPE_EMAIL    = 'email_internal'

const AccountSchema = Schema({
  kind: {
    type: String,
    enum: [
      ACCOUNT_TYPE_FACEBOOK,
      ACCOUNT_TYPE_TWITTER,
      ACCOUNT_TYPE_EMAIL
    ],
  },
  password: {
    type: String,
    hideJSON: true
  },
  uid: String
})

export const ModelName = 'User'

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    uniqueCaseInsensitive: true
  },
  accounts: {
    type: [AccountSchema],
    hideJSON: true
  },
  email: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  about: {
    type: String,
  },
  profile: {
    fullName: String,
    avatar: {type: Schema.Types.ObjectId, ref: UploadRef},
    cover: {type: Schema.Types.ObjectId, ref: UploadRef},
  },
  passwordResetToken: String,
  emailConfirmationToken: String,
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
  introTooltips: [{
    name: String,
    seen: Boolean
  }]
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

UserSchema.virtual('isFacebookConnected')
  .get(function() {
    return 0 < _.size(
      _.find(this.accounts, account => account.kind === ACCOUNT_TYPE_FACEBOOK)
    )
  })

UserSchema.virtual('isTwitterConnected')
  .get(function() {
    return 0 < _.size(
      _.find(this.accounts, account => account.kind === ACCOUNT_TYPE_TWITTER)
    )
  })

UserSchema.statics = {
  createFromEmailData(name, email, username, password) {
    return encryptPassword(password).then(hashedPassword => {
      return this.create({
        username,
        email,
        accounts: [{
          kind: ACCOUNT_TYPE_EMAIL,
          password: hashedPassword
        }],
        profile: {
          fullName: name
        },
        emailConfirmationToken: uuid()
      })
    })
  },
  createFromFacebookData(fbid, email, name, pictureUrl) {
    // trim the name to be 10 characters long max
    const trimmedName = name.slice(0, 9).trim()
    // Make a semi-random username for the user:
    const username = `${_.kebabCase(trimmedName)}-${randToken.generate(10)}`

    return this.create({
      username,
      email,
      accounts: [{
        kind: ACCOUNT_TYPE_FACEBOOK,
        uid: fbid
      }],
      profile: {
        fullName: name
      },
      emailConfirmationToken: uuid()
    })
  }
}

UserSchema.methods = {

  // Returns the password for email signups/logins
  getInternalPassword() {
    const internalAccount = _.find(this.accounts, account => {
      return account.kind === ACCOUNT_TYPE_EMAIL
    })

    if (internalAccount) {
      return internalAccount.password
    }

    return null
  }

}

UserSchema.post('save', function(error, doc, next) {
  console.log('err', error)
  if (error.name === 'ValidationError') {
    next(new CoreError(error.message))
  } else {
    next(new CoreError('Error, please try again.', {
      originalError: error
    }))
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

UserSchema.plugin(uniqueValidator, {
  message: '{PATH} already taken'
})
UserSchema.plugin(mongooseHidden)
UserSchema.plugin(softDelete)

export default mongoose.model(ModelName, UserSchema)
