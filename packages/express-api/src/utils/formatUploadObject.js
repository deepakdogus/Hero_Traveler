import _ from 'lodash'
import path from 'path'

export default function formatUploadObject(file, options = {}) {

  // Build the unique filename from the file object
  // since Cloudinary doesnt give it to us
  console.log('file', file, options)
  const ext = path.extname(file.url)
  const storedFilename = _.last(file.public_id.split('/')) + ext
  const folder = file.public_id.split('/')[0]

  if (options.purpose === 'coverVideo') {
    options.streamingFormats = {}
    let baseUrl = file.secure_url.split('.')
    baseUrl.pop()
    baseUrl = baseUrl.join('.')
    options.streamingFormats.HLS = baseUrl + '.m3u8'
    options.streamingFormats.DASH = baseUrl + '.mpd'
  }

  return _.merge({
    altText: file.originalname,
    original: {
      filename: storedFilename,
      folders: [folder],
      path: `${folder}/${storedFilename}`,
      bucket: process.env.AWS_S3_BUCKET,
      meta: {
        width: file.width,
        height: file.height,
        size: file.size,
        mimeType: file.mimetype,
        playableDuration: file.playableDuration,
        crop: file.crop,
        coordinates: file.coordinates
      }
    }
  }, options)
}
