import {Schema} from 'mongoose'

import Activity from './activity'
import {ModelName as UserRef} from './user'
import {ModelName as StoryRef} from './story'
import {ModelName as CommentRef} from './comment'

const StoryCommentActivitySchema = Schema({
  story: {
    type: Schema.Types.ObjectId,
    ref: StoryRef,
    required: true,
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: CommentRef,
    required: true,
  }
})

StoryCommentActivitySchema.statics = {
  add(user, fromUser, comment, story) {
    // Don't create an activity if you comment on your own story
    if (user.equals(fromUser)) {
      return Promise.resolve()
    }

    // Update the same activity record to prevent seeing
    // the same activity several times in a row,
    // or insert a new record.
    return this.create({
      user,
      fromUser,
      comment,
      story,
    })
  }
}

export default Activity.discriminator('ActivityStoryComment', StoryCommentActivitySchema)
