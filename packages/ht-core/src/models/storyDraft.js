import mongoose from 'mongoose'
import {ModelName as CategoryRef} from './category'
import {ModelName as UserRef} from './user'
import {Constants} from '@rwoody/ht-util'

const StoryDraftSchema = new mongoose.Schema({
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
    type: mongoose.Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: CategoryRef
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('StoryDraft', StoryDraftSchema)