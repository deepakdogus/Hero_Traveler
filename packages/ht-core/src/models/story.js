import mongoose from 'mongoose'

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
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
  likes: {
    type: Number,
    default: 0
  },
  coverImage: {
    type: String
  },
});


StorySchema.statics.getUserFeed = function getUserFeed(userId){
    return this.find({author: {$ne: userId}})
}

export default mongoose.model('Story', StorySchema)


//
// stories: