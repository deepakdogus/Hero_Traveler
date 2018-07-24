import mongoose from 'mongoose'

import {ModelName as UserRef} from './user'
import {ModelName as GuideRef} from './guide'

export const ModelName = 'GuideLike'

const GuideLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: UserRef,
    required: true,
    index: true
  },
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: GuideRef,
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

GuideLikeSchema.statics = {
  getUserLikeGuideIds(userId: string): Promise<mongoose.Types.ObjectId[]> {
    return this.find({
      user: userId,
    })
    .lean()
    .distinct('guide')
  }
}

export default mongoose.model(ModelName, GuideLikeSchema)
