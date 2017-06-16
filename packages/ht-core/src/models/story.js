import mongoose, {Schema} from 'mongoose'
import _ from 'lodash'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'
import {ModelName as CategoryRef} from './category'
import {ModelName as UserRef} from './user'
import {ModelName as UploadRef} from './upload'
import {Constants, getGoogleLatLng} from '@rwoody/ht-util'
export const ModelName = 'Story'

const StorySchema = new Schema({
  title: {
    type: String,
  },
  // slug: {
  //   type: String,
  //   slug: 'title',
  //   unique: true
  // },
  type: {
    type: String,
    enum: [
      Constants.STORY_TYPE_EAT_VALUE,
      Constants.STORY_TYPE_STAY_VALUE,
      Constants.STORY_TYPE_DO_VALUE,
    ],
    default: Constants.STORY_TYPE_EAT_VALUE,
  },
  draft: {
    type: Boolean,
    index: true
  },
  description: {
    type: String
  },
  videoDescription: {
    type: String
  },
  author: {
    type: Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  categories: [{
    type: Schema.ObjectId,
    ref: CategoryRef,
  }],
  content: {
    type: String
  },
  location: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
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

StorySchema.pre('save', function(next) {
  if (_.size(this.location) > 0 && this.isModified('location')){
    getGoogleLatLng(this.location)
    .then(latlng => {
      this.latitude = latlng.latitude
      this.longitude = latlng.longitude
      next()
    })
  }
  else next();
})

StorySchema.statics = {

  get(/* args */) {
    return this.findOne(...arguments)
      .populate({
        path: 'author',
        populate: {
          path: 'profile.cover profile.avatar'
        }
      })
      .populate('categories')
      .populate('coverImage coverVideo')
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
      .populate('coverImage coverVideo')
      .sort({createdAt: -1})
  },

  getUserFeed(userId: string, followingIds: string[]) {
    return this
      .list({
        draft: false,
        $or: [
          {author: userId},
          {author: {$in: followingIds}},
          {category: {$in: followingIds}},
        ]
      })
      .exec()
  },

  getUserStories(userId) {
    return this
      .list({author: userId, draft: false})
      .exec()
  },

  getSearchStory(storyId) {
    return this.findOne({
      _id: storyId
    })
    .select('title description createdAt content location tripDate coverImage coverVideo author categories')
    .populate('coverImage coverVideo author categories')
    .exec()
  }
}

StorySchema.plugin(slug, {truncate: 120})
StorySchema.plugin(softDelete, {overrideMethods: true})

export default mongoose.model(ModelName, StorySchema)
