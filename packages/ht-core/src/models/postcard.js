import Promise from 'bluebird'
import mongoose, { Schema } from 'mongoose'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'
import { ModelName as UserRef } from './user'
import { ModelName as UploadRef } from './upload'
export const ModelName = 'Postcard'

const PostcardSchema = new Schema(
  {
    title: {
      type: String
    },
    author: {
      type: Schema.ObjectId,
      ref: UserRef,
      required: true
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
    coverImage: {
      type: Schema.ObjectId,
      ref: UploadRef
    },
    coverVideo: {
      type: Schema.ObjectId,
      ref: UploadRef
    },
    publishedDate: {
      type: Date
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
      .sort({ publishedDate: -1 })
  },

  getPostcards(limit = 100) {
    return Promise.props({
      count: this.count().exec(),
      feed: this.list({
        publishedDate: {
          $gte: new Date(new Date().getTime() - 24 * 3600 * 1000), // 24 hours agp
          $lt: new Date()
        }
      })
        .skip(0)
        .limit(limit)
        .exec()
    })
  }
}

PostcardSchema.plugin(slug, { truncate: 120 })
PostcardSchema.plugin(softDelete, { overrideMethods: true })

export default mongoose.model(ModelName, PostcardSchema)
