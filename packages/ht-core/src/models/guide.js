import mongoose, {Schema} from 'mongoose'
import _ from 'lodash'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'
import {ModelName as CategoryRef} from './category'
import {ModelName as UserRef} from './user'
import {ModelName as UploadRef} from './upload'
import {ModelName as StoryRef} from './story'
import {Constants} from '@hero/ht-util'
export const ModelName = 'Guide'

const GuideSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  author: {
    type: Schema.ObjectId,
    ref: UserRef,
    required: true,
  },
  stories: [{
    type: Schema.ObjectId,
    ref: StoryRef,
  }],
  categories: [{
    type: Schema.ObjectId,
    ref: CategoryRef,
  }],
  locations: [{
    name: {
      type: String,
    },
    locality: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
  }],
  flagged: {
    type: Boolean,
    default: false,
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
  isPrivate: {
    type: Boolean,
    default: false,
  },
  cost: {
    type: Number,
  },
  duration: {
    type: Number,
    min: 1,
    max: 30,
  },
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

GuideSchema.statics = {

  get(/* args */) {
    return this.findOne(...arguments)
    .populate({
      path: 'author',
      populate: {
        path: 'profile.cover profile.avatar'
      }
    })
    .populate('categories')
    .populate('coverImage')
  },
  list(/* args */) {
    return this.find(...arguments)
    .populate({
      path: 'author',
      populate: {
        path: 'profile.cover profile.avatar'
      }
    })
    .populate('categories')
    .populate('coverImage')
    .sort({createdAt: -1})
  },
  getUserFeedGuides(userId, followingIds) {
    return this
      .list({
        $or: [
          {author: userId},
          {author: {$in: followingIds}},
          {categories: {$in: followingIds}},
          {featured: true},
        ]
      })
      .exec()
  },
}


export default mongoose.model(ModelName, GuideSchema)
