import {Schema} from 'mongoose'

import Upload from './upload'

const ImageSchema = Schema({
  altText: String,
  original: {
    filename: String,
    folders: [String],
    path: String,
    bucket: String,
    width: Number,
    height: Number,
    meta: Schema.Types.Mixed
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
