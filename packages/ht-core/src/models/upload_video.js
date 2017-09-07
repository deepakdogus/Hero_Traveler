import {Schema} from 'mongoose'

import Upload from './upload'

const VideoSchema = Schema({
  original: {
    filename: String,
    folders: [String],
    path: String,
    bucket: String,
    width: Number,
    height: Number,
    meta: Schema.Types.Mixed
  }
})

export default Upload.discriminator('Video', VideoSchema)
