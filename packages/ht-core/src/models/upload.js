import mongoose, {Schema} from 'mongoose'
import {ModelName as StoryRef} from './story'
import {ModelName as UserRef} from './user'

export const ModelName = 'Upload'

const UploadSchema = new Schema({
  story: {
    type: Schema.Types.ObjectId,
    ref: StoryRef
  },
  purpose: {
    type: String,
    enum: [
      'avatar',
      'userCover',
      'coverImage',
      'coverVideo',
      'storyImage',
      'storyVideo',
    ]
  }
}, {
  timestamps: true,
  discriminatorKey: 'kind',
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

export default mongoose.model(ModelName, UploadSchema)
