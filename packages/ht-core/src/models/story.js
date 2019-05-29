import Promise from 'bluebird'
import mongoose, { Schema } from 'mongoose'
import _ from 'lodash'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'
import { ModelName as CategoryRef } from './category'
import { ModelName as HashtagRef } from './hashtag'
import { ModelName as UserRef } from './user'
import { ModelName as UploadRef } from './upload'
import { Constants } from '@hero/ht-util'
export const ModelName = 'Story'

const StorySchema = new Schema(
  {
    title: {
      type: String
    },
    // slug: {
    //   type: String,
    //   slug: 'title',
    //   unique: true
    // },
    type: {
      type: String,
      enum: [
        Constants.STORY_TYPE_SEE_VALUE,
        Constants.STORY_TYPE_EAT_VALUE,
        Constants.STORY_TYPE_STAY_VALUE,
        Constants.STORY_TYPE_DO_VALUE
      ]
    },
    draft: {
      type: Boolean,
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
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
    categories: [
      {
        type: Schema.ObjectId,
        ref: CategoryRef
      }
    ],
    hashtags: [
      {
        type: Schema.ObjectId,
        ref: HashtagRef
      }
    ],
    content: {
      type: String
    },
    draftjsContent: {
      type: Schema.Types.Mixed,
      default: {}
    },
    locationInfo: {
      name: {
        type: String
      },
      locality: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      },
      latitude: {
        type: Number
      },
      longitude: {
        type: Number
      }
    },
    // location is being phased out in favor of locationInfo and
    // will be removed in future.
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
    flagged: {
      type: Boolean,
      default: false
    },
    counts: {
      likes: {
        type: Number,
        default: 0
      },
      comments: {
        type: Number,
        default: 0
      }
    },
    coverImage: {
      type: Schema.ObjectId,
      ref: UploadRef
    },
    coverVideo: {
      type: Schema.ObjectId,
      ref: UploadRef
    },
    coverCaption: {
      type: String
    },
    cost: {
      type: Number
    },
    currency: {
      type: String
    },
    travelTips: {
      type: String
    },
    publishedDate: {
      type: Date
    },
    rating: {
      type: Number
    },
    actionButton: {
      type: {
        type: String
      },
      link: {
        type: String
      }
    }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
)

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
      .populate('hashtags')
      .populate('coverImage coverVideo')
  },

  list(/* args */) {
    console.log(...arguments, 'these are args')
    return this.find(...arguments)
      .populate({
        path: 'author',
        populate: {
          path: 'profile.cover profile.avatar'
        }
      })
      .populate('categories')
      .populate('hashtags')
      .populate('coverImage coverVideo')
      .sort({ publishedDate: -1 })
  },

  // includes soft-deleted by default
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
      count: this.countWithDeleted(queryToApply).exec(),
      data: this.findWithDeleted(queryToApply)
        .populate('author')
        .populate('categories.title')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortToApply)
          .exec(),
    })
  },

  getUserFeed(userId, followingIds, page = 1, perPage = 100) {
    const query = {
      draft: false,
      flagged: false,
      $or: [
        { author: userId },
        { author: { $in: followingIds } },
        { categories: { $in: followingIds } },
        { featured: true }
      ]
    }

    return this.getFeed(query, page, perPage)
  },

  getStoriesById(ids) {
    const query = {
      _id: { $in: ids.map(id => mongoose.Types.ObjectId(id)) }
    }
    return this.getFeed(query)
  },

  getStoriesByAuthors(authors) {
    const query = { author: { $in: authors} }
    return this.getFeed(query)
  },

  getFeed(query, page = 1, perPage = 100) {
    return Promise.props({
      count: this.count(query).exec(),
      feed: this.list(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec()
    })
  },

  getUserStories({userId, type}) {
    console.log({userId, type})
    return this.list({ author: userId, draft: false, type }).exec()
  },

  getCountUserStories(userId) {
    return this
      .count({author: userId})
      .exec()
  },

  getSearchStory(storyId) {
    return this.findOne({
      _id: storyId
    })
      .select(
        'title description createdAt content location tripDate coverImage coverVideo author categories'
      )
      .populate('coverImage coverVideo author categories hashtags')
      .exec()
  },

  isAuthor(storyId, userId) {
    return this.findOne({ _id: storyId })
      .select('author')
      .then(story => {
        return String(story.author) === String(userId)
      })
  }
}

StorySchema.index({title: 'text'})

StorySchema.plugin(slug, {truncate: 120})
StorySchema.plugin(softDelete, {overrideMethods: true})

export default mongoose.model(ModelName, StorySchema)
