import mongoose, {Schema} from 'mongoose'

import {ModelName as UserRef} from './user'
import Thread, {ModelName as ThreadRef} from './thread'

export const ModelName = 'ThreadMessage'

const ThreadMessageSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  thread: {
    type: Schema.ObjectId,
    ref: ThreadRef,
    required: true,
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

ThreadMessageSchema.statics = {
  list(threadId, readingUserId) {
    console.log('message list', threadId, readingUserId)
    return Thread.findOneAndUpdate({
      _id: threadId,
      'users.user': mongoose.Types.ObjectId(readingUserId)
    }, {
      $set: {
        'users.$.hasSeenLastMessage': true
      }
    }).then(() => {
      return this.find({
        thread: threadId
      })
      .sort({createdAt: 1})
    })
  }
}

ThreadMessageSchema.index({thread: 1, createdAt: -1})

export default mongoose.model(ModelName, ThreadMessageSchema)