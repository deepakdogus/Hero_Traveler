import mongoose, {Schema} from 'mongoose'
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
  if (this.isModified('location')){
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
  getUserFeed(userId: string, followingIds: string[]) {
    return this
      .find({
        author: {$ne: userId},
        draft: false,
        $or: [
          {author: {$in: followingIds}},
          {category: {$in: followingIds}},
        ]
      })
      .sort({createdAt: -1, 'counts.likes': -1})
      .populate('author author.profile.avatar author.profile.cover')
      .populate('categories')
      .populate('coverImage coverVideo')
  },

  getUserStories(userId) {
    return this
      .find({author: userId, draft: false})
      .sort({createdAt: -1})
      .populate('author author.profile.avatar author.profile.cover')
      .populate('categories')
      .populate('coverImage coverVideo')
  },

  getSearchStory(storyId) {
    return this.findOne({
      _id: storyId
    })
    .select('title description createdAt content location tripDate coverImage coverVideo author')
    .populate('coverImage coverVideo author')
  }
}

StorySchema.plugin(slug, {truncate: 120})
StorySchema.plugin(softDelete)

export default mongoose.model(ModelName, StorySchema)
