import _ from 'lodash'
import Promise from 'bluebird'
import bcrypt from 'bcrypt'
import randToken from 'rand-token'
import uuid from 'uuid'
import mongoose, {Schema} from 'mongoose'
import softDelete from 'mongoose-delete'
import uniqueValidator from 'mongoose-unique-validator'
import {Constants} from '@hero/ht-util'

import CoreError from '../utils/error'
import {ModelName as UploadRef} from './upload'
import {ModelName as DeviceRef} from './user_device'
import mongooseHidden from './plugins/mongooseHidden'
import encryptPassword from '../utils/encryptPassword'

export const ACCOUNT_TYPE_FACEBOOK = 'facebook'
export const ACCOUNT_TYPE_TWITTER  = 'twitter'
export const ACCOUNT_TYPE_EMAIL    = 'email_internal'

const comparePassword = Promise.promisify(bcrypt.compare)

const defaultNotificationTypes = [
  Constants.USER_NOTIFICATION_STORY_LIKE,
  Constants.USER_NOTIFICATION_STORY_COMMENT,
  Constants.USER_NOTIFICATION_FOLLOWER,
]

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
  usernameIsTemporary: {
    type: Boolean,
    default: false
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
  isDeleted: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String
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
  bio: {
    type: String,
    maxlength: 500
  },
  passwordResetToken: {
    hidden: true,
    type: String
  },
  emailConfirmationToken: {
    hidden: true,
    type: String
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
      Constants.USER_ROLES_FOUNDING_MEMBER_VALUE,
      Constants.USER_ROLES_FELLOW_VALUE,
    ],
    default: Constants.USER_ROLES_USER_VALUE
  },
  introTooltips: [{
    name: String,
    seen: Boolean
  }],
  notificationTypes: [{
    type: String,
    enum: [
      Constants.USER_NOTIFICATION_STORY_LIKE,
      Constants.USER_NOTIFICATION_STORY_COMMENT,
      Constants.USER_NOTIFICATION_FOLLOWER,
    ]
  }],
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

UserSchema.index({username: 'text', email: 'text', 'profile.fullName': 'text'})

UserSchema.virtual('isFacebookConnected')
  .get(function() {
    return this.hasFacebookAccountInfo()
  })

UserSchema.virtual('devices', {
  ref: DeviceRef,
  localField: '_id',
  foreignField: 'user',
  // options: {
  //   sort: {createdAt: -1},
  //   limit: 1
  // }
})

UserSchema.statics = {
  createFromEmailData(name, email, username, password, hasDevice) {
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
        emailConfirmationToken: uuid(),
        notificationTypes: hasDevice ? defaultNotificationTypes : [],
      })
    })
  },
  createFromFacebookData(fbid, email, name, pictureUrl) {
    // trim the name to be 10 characters long max
    const trimmedName = name.slice(0, 9).trim()
    // Make a semi-random username for the user:
    const username = `${_.kebabCase(trimmedName)}-${randToken.generate(10)}`

    if (!email) {
      // Make a semi-random email for the user that we can detect on the frontend
      email = `${randToken.generate(10)}@herotraveler`
    }

    return this.create({
      username,
      usernameIsTemporary: true,
      email,
      accounts: [{
        kind: ACCOUNT_TYPE_FACEBOOK,
        uid: fbid
      }],
      profile: {
        fullName: name
      },
      emailConfirmationToken: uuid(),
      notificationTypes: defaultNotificationTypes,
    })
  },
  list({ page = 1, perPage = 5, search='', sort, query }) {
    let queryToApply = {}

    if (query) {
      queryToApply = query
    }

    if (search !== '') {
      queryToApply['$text'] = { $search: search }
    } 

    let sortToApply = {createdAt: -1}
    if (sort) {
      sortToApply = {
        [sort.fieldName]: sort.order
      }
    }

    return Promise.props({
      count: this.count(queryToApply).exec(),
      data: this.find(queryToApply)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortToApply)
          .exec(),
    })
  }
}

UserSchema.methods = {
  async updatePassword(password) {
    const hashedPassword = await encryptPassword(password)
    const internalAccount = _.find(this.accounts, (a) => a.kind === ACCOUNT_TYPE_EMAIL)
    internalAccount.password = hashedPassword
    this.passwordResetToken = undefined
    return this.save()
  },

  // Returns the password for email signups/logins
  getInternalPassword() {
    const internalAccount = _.find(this.accounts, account => {
      return account.kind === ACCOUNT_TYPE_EMAIL
    })

    if (internalAccount) {
      return internalAccount.password
    }

    return null
  },

  receivesLikeNotifications() {
    return _.includes(
      this.notificationTypes,
      Constants.USER_NOTIFICATION_STORY_LIKE
    )
  },

  comparePassword(password) {
    return comparePassword(password, this.getInternalPassword())
    .then(isPasswordCorrect => {
      if (!isPasswordCorrect) {
        return Promise.reject(new Error('Incorrect password'))
      }
      return this
    })
  },

  receivesCommentNotifications() {
    return _.includes(
      this.notificationTypes,
      Constants.USER_NOTIFICATION_STORY_COMMENT
    )
  },

  receivesFollowerNotifications() {
    return _.includes(
      this.notificationTypes,
      Constants.USER_NOTIFICATION_FOLLOWER
    )
  },

  hasFacebookAccountInfo() {
    return !!_.find(this.accounts, account => account.kind === ACCOUNT_TYPE_FACEBOOK)
  },

  hasFacebookId(fbid) {
    return !!_.find(this.accounts, account => {
      return (
        account.kind === ACCOUNT_TYPE_FACEBOOK &&
        account.uid === fbid
      )
    })
  },

  connectFacebook(fbid) {
    if (!this.hasFacebookId(fbid)) {
      this.accounts.push({
        kind: ACCOUNT_TYPE_FACEBOOK,
        uid: fbid
      })
    }
    return this;
  }

}

UserSchema.post('save', function(error, doc, next) {
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
UserSchema.plugin(softDelete, {overrideMethods: true})

export default mongoose.model(ModelName, UserSchema)
