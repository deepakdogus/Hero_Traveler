import mongoose from 'mongoose'
import softDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'

export const ModelName = 'Category'

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  // slug: {
  //   type: String,
  //   slug: 'title',
  //   unique: true
  // },
  // Default categories are created by the system
  isDefault: {
    type: Boolean,
    default: false
  },
  // Categories can be promoted by admins
  isPromoted: {
    type: Boolean,
    default: false
  },
  image: {
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
      thumbnail240: {
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
  counts: {
    followers: {
      type: Number,
      default: 0
    },
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

CategorySchema.pre('save', function(next) {
  if (this.counts.stories === 10) {
    this.isPromoted = true
  }
  next()
})

CategorySchema.plugin(slug, {truncate: 50})
CategorySchema.plugin(softDelete)

export default mongoose.model(ModelName, CategorySchema)
