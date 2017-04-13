import mongoose from 'mongoose'

import {ModelName as UserRef} from './user'
import {ModelName as StoryRef} from './story'

export const ModelName = 'StoryLike'

const StoryLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  story: {
    type: mongoose.Schema.ObjectId,
    ref: StoryRef,
    required: true
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

export default mongoose.model(ModelName, StoryLikeSchema)
