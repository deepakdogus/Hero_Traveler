import mongoose from 'mongoose'

const Story = mongoose.model('Story', {
  title: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default Story
