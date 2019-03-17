import Promise from 'bluebird'
import mongoose, {Schema} from 'mongoose'
import _ from 'lodash'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'
import {ModelName as UserRef} from './user'
import {ModelName as UploadRef} from './upload'
import {Constants} from '@hero/ht-util'
export const ModelName = 'Postcard'

const PostcardSchema = new Schema({
  title: {
    type: String,
  },
  author: {
    type: Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  locationInfo: {
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
  coverImage: {
    type: Schema.ObjectId,
    ref: UploadRef,
  },
  coverVideo: {
    type: Schema.ObjectId,
    ref: UploadRef,
  },
  publishedDate: {
    type: Date,
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

PostcardSchema.statics = {

  get(/* args */) {
    return this.findOne(...arguments)
      .populate({
        path: 'author',
        populate: {
          path: 'profile.cover profile.avatar'
        }
      })
      .populate('locationInfo')
      .populate('coverImage coverVideo')
  },

  list(/* args */) {
    return this.find(...arguments)
      .populate('coverImage coverVideo')
      .sort({publishedDate: -1})
  },

  getPostcards(limit = 100) {
    return Promise.props({
      count: this.count().exec(),
      feed: this
        .list()
        .skip(0)
        .limit(limit)
        .exec(),
    })
  },
}

PostcardSchema.plugin(slug, {truncate: 120})
PostcardSchema.plugin(softDelete, {overrideMethods: true})

export default mongoose.model(ModelName, PostcardSchema)
