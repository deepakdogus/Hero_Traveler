import {Schema} from 'mongoose'

import Activity from './activity'
import {ModelName as UserRef} from './user'
import {ModelName as StoryRef} from './story'

const StoryLikeActivitySchema = Schema({
  story: {
    type: Schema.Types.ObjectId,
    ref: StoryRef,
    required: true,
  }
})

StoryLikeActivitySchema.statics = {
  add(user, fromUser, story) {

    // Don't create an activity if you like your own story
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
        story
      }, {
        $set: {
          user,
          fromUser,
          story
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

export default Activity.discriminator('ActivityStoryLike', StoryLikeActivitySchema)
