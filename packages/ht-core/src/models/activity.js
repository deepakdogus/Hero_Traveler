import mongoose, {Schema} from 'mongoose'

import {ModelName as UserRef} from './user'

export const ModelName = 'Activity'

const ActivitySchema = new Schema({
  // Has this activity been seen yet?
  seen: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserRef,
    required: true
  }
}, {
  timestamps: true,
  discriminatorKey: 'kind',
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

// Always sorting new -> old
ActivitySchema.index({user: 1, seen: 1, createdAt: -1})

ActivitySchema.statics = {
  list(userId) {
    return this.find({
      user: userId
    })
    .sort({createdAt: -1})
    .populate({
      path: 'fromUser',
      populate: { path: 'profile.avatar' }
    })
    .populate('story story.coverImage story.coverVideo')
    .populate('comment')
  },

  setRead(activityId) {
    return this.update({
      _id: activityId
    }, {
      seen: true
    })
  }
}

export default mongoose.model(ModelName, ActivitySchema)
