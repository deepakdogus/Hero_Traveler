import mongoose, {Schema} from 'mongoose'
import softDelete from 'mongoose-delete'
import {ModelName as CategoryRef} from './category'
import {ModelName as UserRef} from './user'
import {ModelName as UploadRef} from './upload'
import {Constants} from '@rwoody/ht-util'

export const ModelName = 'Story'

const StorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      Constants.STORY_TYPE_EAT_VALUE,
      Constants.STORY_TYPE_STAY_VALUE,
      Constants.STORY_TYPE_DO_VALUE,
    ],
    default: Constants.STORY_TYPE_EAT_VALUE,
    required: true
  },
  description: {
    type: String
  },
  author: {
    type: Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  category: {
    type: Schema.ObjectId,
    ref: CategoryRef,
    required: true
  },
  content: {
    type: String
  },
  location: {
    type: String
  },
  tripDate: {
    type: Date
  },
  counts: {
    likes: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
  },
  coverImage: {
    type: Schema.ObjectId,
    ref: UploadRef,
  },
  coverVideo: {
    type: Schema.ObjectId,
    ref: UploadRef,
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

StorySchema.statics = {
  getUserFeed(userId: string, followingIds: string[]) {
    return this
      .find({
        author: {$ne: userId},
        $or: [
          {author: {$in: followingIds}},
          {category: {$in: followingIds}},
        ]
      })
      .sort({createdAt: -1, 'counts.likes': -1})
      .populate('author author.profile.avatar')
      .populate('category')
      .populate('coverImage')
      .populate('coverVideo')
  },

  getUserStories(userId) {
    return this
      .find({author: userId})
      .sort({createdAt: -1})
      .populate('author author.profile.avatar')
      .populate('category')
      .populate('coverImage')
      .populate('coverVideo')
  }
}

StorySchema.plugin(softDelete)

export default mongoose.model(ModelName, StorySchema)
