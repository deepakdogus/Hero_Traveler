import mongoose, {Schema} from 'mongoose'
import softDelete from 'mongoose-delete'
import {ModelName as CategoryRef} from './category'
import {ModelName as UserRef} from './user'
import {ModelName as UploadRef} from './upload'
import {Constants} from '@rwoody/ht-util'

export const ModelName = 'StoryDraft'

const StoryDraftSchema = new Schema({
  title: {
    type: String
  },
  type: {
    type: String,
    enum: [
      Constants.STORY_TYPE_EAT_VALUE,
      Constants.STORY_TYPE_STAY_VALUE,
      Constants.STORY_TYPE_DO_VALUE,
    ],
    default: Constants.STORY_TYPE_EAT_VALUE
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  author: {
    type: Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  category: {
    type: Schema.ObjectId,
    ref: CategoryRef
  },
  content: {
    type: String
  },
  tripDate: {
    type: Date
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
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

StoryDraftSchema.plugin(softDelete)

export default mongoose.model(ModelName, StoryDraftSchema)
