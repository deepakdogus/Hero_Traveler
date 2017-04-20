import mongoose, {Schema} from 'mongoose'
import {ModelName as UserModelRef} from './user'
import {ModelName as CategoryModelRef} from './category'

export const ModelName = 'Follower'

const FollowerSchema = new mongoose.Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: UserModelRef
  },
  followee: {
    type: Schema.Types.ObjectId,
    refPath: 'type'
  },
  type: {
    type: String,
    enum: [
      UserModelRef,
      CategoryModelRef
    ]
  },
  startAt: {
    type: Date,
    default: Date.now
  },
  endAt: Date
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

FollowerSchema.statics = {
  // Look up who a user follows
  getUserFollowers(userId) {
    return this.find({
      follower: userId,
      type: UserModelRef,
      endAt: {
        $exists: false
      }
    })
  },
  // Look up who follows a user
  getUserFollowees(userId) {
    return this.find({
      followee: userId,
      type: UserModelRef,
      endAt: {
        $exists: false
      }
    })
  },
  // Look up user categories
  getUserCategories(userId) {
    return this.find({
      follower: userId,
      type: CategoryModelRef,
      endAt: {
        $exists: false
      }
    })
  }
}

export default mongoose.model(ModelName, FollowerSchema)
