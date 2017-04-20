import {Schema} from 'mongoose'

import Upload from './upload'

const VideoSchema = Schema({
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
  }
})

export default Upload.discriminator('Video', VideoSchema)