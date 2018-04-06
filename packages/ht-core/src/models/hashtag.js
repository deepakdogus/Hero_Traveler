import mongoose from 'mongoose'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'

export const ModelName = 'Hashtag'

const HashtagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  // Default hashtags are created by the system
  isDefault: {
    type: Boolean,
    default: false
  },
  // Hashtags can be promoted by admins
  isPromoted: {
    type: Boolean,
    default: false
  },
  counts: {
    stories: {
      type: Number,
      default: 0
    }
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

HashtagSchema.pre('save', function(next) {
  if (this.counts.stories === 10) {
    this.isPromoted = true
  }
  next()
})

HashtagSchema.plugin(slug, {truncate: 50})
HashtagSchema.plugin(softDelete, {overrideMethods: true})

export default mongoose.model(ModelName, HashtagSchema)
