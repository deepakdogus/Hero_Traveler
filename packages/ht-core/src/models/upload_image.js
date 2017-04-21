import {Schema} from 'mongoose'

import Upload from './upload'

const ImageSchema = Schema({
  altText: String,
  original: {
    filename: String,
    path: String,
    bucket: String,
    width: Number,
    height: Number,
    meta: {
      mimeType: String,
      size: Number,
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
})

export default Upload.discriminator('Image', ImageSchema)