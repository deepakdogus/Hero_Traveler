import {Schema} from 'mongoose'

import Activity from './activity'
import {ModelName as UserRef} from './user'
import {ModelName as StoryRef} from './story'
import {ModelName as CommentRef} from './comment'

const FollowActivitySchema = Schema({
  // The user that did the following
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: UserRef,
    required: true,
  }
})

FollowActivitySchema.statics = {
  add(user, fromUser) {
    // Update the same activity record to prevent seeing
    // the same activity several times in a row,
    // or insert a new record.
    return new Promise((resolve, reject) => {
      this.findOneAndUpdate({
        user,
        fromUser
      }, {
        $set: {
          user,
          fromUser
        }
      }, {
        new: true,
        passRawResult: true,
        upsert: true,
        setDefaultsOnInsert: true
      }, (err, doc, {lastErrorObject: {updatedExisting}}) => {
        return resolve({activity: doc, isNew: !updatedExisting})
      })
    })
  }
}

export default Activity.discriminator('ActivityFollow', FollowActivitySchema)
