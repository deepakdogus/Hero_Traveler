import mongoose from 'mongoose'

const StoryDraftSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  content: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('StoryDraft', StoryDraftSchema)