import mongoose from 'mongoose'

export const ModelName = 'Category'

const CategorySchema = new mongoose.Schema({
  title: String,
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
});

export default mongoose.model(ModelName, CategorySchema)
