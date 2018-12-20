import mongoose, {Schema} from 'mongoose'
import _ from 'lodash'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'
import {ModelName as CategoryRef} from './category'
import {ModelName as UserRef} from './user'
import {ModelName as UploadRef} from './upload'
import {ModelName as StoryRef} from './story'
import {Constants} from '@hero/ht-util'
import Promise from 'bluebird'
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
  verified: {
    type: Boolean,
    default: false,
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
  list(query, isAuthor = false) {
    if (!isAuthor) {
      if (query.stories) query.stories.$not = hideStorylessGuides.$not
      else query.stories = hideStorylessGuides.stories
      query.isPrivate = false
    }
    return this.find(query)
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
  getMany({ page = 1, perPage = 5, search='', sort, query }) {
    let queryToApply = {}

    if (query) {
      queryToApply = query
    }

    if (search !== '') {
      queryToApply['$text'] = { $search: search }
    } 

    let sortToApply = {createdAt: -1}
    if (sort) {
      sortToApply = {
        [sort.fieldName]: sort.order
      }
    }
    return Promise.props({
      count: this.count(queryToApply).exec(),
      data: this.find(queryToApply)
        .populate('author')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortToApply)
          .exec(),
    })
  },
}

GuideSchema.plugin(softDelete, {overrideMethods: true})

const hideStorylessGuides = {
  stories: {
    $not: {
      "$size": 0
    }
  }
}

export default mongoose.model(ModelName, GuideSchema)
