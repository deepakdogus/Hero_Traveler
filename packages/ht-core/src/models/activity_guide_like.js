import {Schema} from 'mongoose'

import Activity from './activity'
import {ModelName as UserRef} from './user'
import {ModelName as GuideRef} from './guide'

const GuideLikeActivitySchema = Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: UserRef,
    required: true,
  },
  guide: {
    type: Schema.Types.ObjectId,
    ref: GuideRef,
    required: true,
  }
})

GuideLikeActivitySchema.statics = {
  add(user, fromUser, guide) {

    // Don't create an activity if you like your own guide
    if (user.equals(fromUser)) {
      return Promise.resolve({isNew: false})
    }

    // Update the same activity record to prevent seeing
    // the same activity several times in a row,
    // or insert a new record.
    return new Promise((resolve, reject) => {
      this.findOneAndUpdate({
        user,
        fromUser,
        guide
      }, {
        $set: {
          user,
          fromUser,
          guide
        }
      }, {
        new: true,
        passRawResult: true,
        upsert: true,
        setDefaultsOnInsert: true
      }, (err, doc, {lastErrorObject}) => {
        if (err) return reject(err)
        return resolve({activity: doc, isNew: !lastErrorObject.updatedExisting})
      })
    })
  }
}

export default Activity.discriminator('ActivityGuideLike', GuideLikeActivitySchema)
