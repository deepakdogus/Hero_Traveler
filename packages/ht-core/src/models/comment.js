import mongoose from 'mongoose'
import {ModelName as StoryRef} from './story'
import {ModelName as UserRef} from './user'
import {ModelName as GuideRef} from './guide'

export const ModelName = 'Comment'

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: UserRef,
    required: true
  },
  story: {
    type: mongoose.Schema.ObjectId,
    ref: StoryRef,
  },
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: GuideRef,
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

export default mongoose.model(ModelName, CommentSchema)
