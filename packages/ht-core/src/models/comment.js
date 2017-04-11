import mongoose from 'mongoose'
import {ModelName as StoryRef} from './story'
import {ModelName as UserRef} from './user'

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
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model(ModelName, CommentSchema)