import mongoose from 'mongoose'

import {ModelName as UserRef} from './user'
import {ModelName as StoryRef} from './story'

export const ModelName = 'StoryBookmark'

const StoryBookmarkSchema = new mongoose.Schema({
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

StoryBookmarkSchema.statics = {

  getUserBookmarks(/* args */) {
    return this.find(...arguments)
      .sort({createdAt: -1})
      .populate({
        path: 'story',
        populate: {
          path: 'categories'
        }
      })
      .populate({
        path: 'story',
        populate: {
          path: 'coverImage coverVideo'
        }
      })
      .populate({
        path: 'story',
        populate: {
          path: 'author',
          populate: {
            path: 'profile.cover profile.avatar'
          }
        }
      })
      .lean()
  }
}
export default mongoose.model(ModelName, StoryBookmarkSchema)
