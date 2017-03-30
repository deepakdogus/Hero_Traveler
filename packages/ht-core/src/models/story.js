import mongoose from 'mongoose'

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  counts: {
    likes: {
      type: Number,
      default: 0
    }
  },
  coverImage: {
    altText: String,
    original: {
      filename: String,
      path: String,
      width: Number,
      height: Number,
      meta: {
        mimeType: String
      }
    },
    versions: {
      mobile: {
        filename: String,
        path: String,
        width: Number,
        height: Number,
        meta: {
          mimeType: String
        }
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});


StorySchema.statics.getUserFeed = function getUserFeed(userId) {
    return this
      .find({author: {$ne: userId}})
      .sort({createdAt: -1})
      .populate('author')
      .populate('category')
}

StorySchema.statics.getUserStories = function getUserStories(userId) {
  return this
    .find({author: userId})
    .sort({createdAt: -1})
    .populate('author')
    .populate('category')
}

export default mongoose.model('Story', StorySchema)
