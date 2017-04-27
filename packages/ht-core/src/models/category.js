import mongoose from 'mongoose'
import softDelete from 'mongoose-delete'

export const ModelName = 'Category'

const CategorySchema = new mongoose.Schema({
  title: String,
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

CategorySchema.plugin(softDelete)

export default mongoose.model(ModelName, CategorySchema)
