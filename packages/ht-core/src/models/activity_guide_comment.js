import {Schema} from 'mongoose'

import Activity from './activity'
import {ModelName as UserRef} from './user'
import {ModelName as GuideRef} from './guide'
import {ModelName as CommentRef} from './comment'

const GuideCommentActivitySchema = Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: UserRef,
    required: true,
  },
  guide: {
    type: Schema.Types.ObjectId,
    ref: GuideRef,
    required: true,
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: CommentRef,
    required: true,
  }
})

GuideCommentActivitySchema.statics = {
  add(user, fromUser, comment, guide) {
    // Don't create an activity if you comment on your own guide
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
      guide,
    })
  }
}

export default Activity.discriminator('ActivityGuideComment', GuideCommentActivitySchema)
