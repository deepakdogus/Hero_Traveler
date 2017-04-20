import mongoose, {Schema} from 'mongoose'
import {ModelName as StoryRef} from './story'
import {ModelName as UserRef} from './user'

export const ModelName = 'Upload'

const UploadSchema = new Schema({
  story: {
    type: Schema.Types.ObjectId,
    ref: StoryRef
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserRef
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
