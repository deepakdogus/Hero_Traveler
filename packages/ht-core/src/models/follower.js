import mongoose, {Schema} from 'mongoose'
import {ModelName as UserModelRef} from './user'
import {ModelName as CategoryModelRef} from './category'

export const ModelName = 'Follower'

const FollowerSchema = new mongoose.Schema({
  // The user that is following the followee
  follower: {
    type: Schema.Types.ObjectId,
    ref: UserModelRef
  },
  // The target thing being followed
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
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

FollowerSchema.statics = {
  followUser(userId, userIdBeingFollowed) {
    return this.create({
      follower: userId,
      followee: userIdBeingFollowed,
      type: UserModelRef
    })
  },

  // called when userId unfollows followeeUserId
  unfollowUser(userId, userIdBeingFollowed) {
    return this.remove({
      follower: userId,
      followee: userIdBeingFollowed
    })
  },

  // Look up who a user follows
  getUserFollowers(userId) {
    return this.find({
      follower: userId,
      type: UserModelRef
    })
    .lean()
    .distinct('followee')
  },
  // Look up who follows a user
  getUserFollowees(userId) {
    return this.find({
      followee: userId,
      type: UserModelRef
    })
    .lean()
    .distinct('follower')
  },
  // Look up user categories
  getUserCategories(userId) {
    return this.find({
      follower: userId,
      type: CategoryModelRef,
    })

  },

  getUserFollowingIds(userId: string): Promise<mongoose.Types.ObjectId[]> {
    return this.find({
      follower: userId,
      endAt: {
        $exists: false
      }
    })
    .lean()
    .distinct('followee')
  }
}

export default mongoose.model(ModelName, FollowerSchema)
