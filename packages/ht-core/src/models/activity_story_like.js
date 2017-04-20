import {Schema} from 'mongoose'

import Activity from './activity'
import {ModelName as UserRef} from './user'
import {ModelName as StoryRef} from './story'

const StoryLikeActivitySchema = Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: UserRef,
    required: true,
  },
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
      return Promise.resolve()
    }

    // Update the same activity record to prevent seeing
    // the same activity several times in a row,
    // or insert a new record.
    return this.findOneAndUpdate({
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
      upsert: true,
      setDefaultsOnInsert: true
    })
  }
}

export default Activity.discriminator('ActivityStoryLike', StoryLikeActivitySchema)