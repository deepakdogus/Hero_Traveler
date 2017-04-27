import mongoose, {Schema} from 'mongoose'

import {ModelName as UserRef} from './user'
import ThreadMessage, {ModelName as MessageRef} from './thread_message'

export const ModelName = 'Thread'

const ThreadSchema = new Schema({
  users: [{
    user: {
      type: Schema.ObjectId,
      ref: UserRef,
      required: true
    },
    hasSeenLastMessage: {
      type: Boolean,
      default: false
    }
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

ThreadSchema.virtual('lastMessage', {
  ref: MessageRef,
  localField: '_id',
  foreignField: 'thread',
  options: {
    sort: {createdAt: -1},
    limit: 1
  }
})

ThreadSchema.statics = {
  // Get a users threads
  list(userId) {
    return this.find({'users.user': userId})
               // Threads are updated with seen state when new messages arrive
               .sort({updatedAt: -1})
               .populate('users.user', 'profile.fullName profile.avatar')
               .populate('lastMessage')
  },
  // Make a new thread
  start(fromUserId, toUserId, content) {
    return this.findOneAndUpdate({
      'users.user': {
        $all: [fromUserId, toUserId]
      }
    }, {
      $set: {
        users: [
          {user: fromUserId, hasSeenLastMessage: true},
          {user: toUserId}
        ]
      }
    }, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    })
    .then(thread => {
      return [
        thread,
        ThreadMessage.create({
          user: fromUserId,
          content,
          thread: thread._id
        })
      ]
    })
    .spread((thread, message) => {
      return {thread, message}
    })
  }
}

ThreadSchema.index({'users.user': 1, updatedAt: -1})

export default mongoose.model(ModelName, ThreadSchema)