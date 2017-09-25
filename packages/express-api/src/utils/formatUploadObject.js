import _ from 'lodash'
import path from 'path'

export default function formatUploadObject(file, folder, options = {}) {

  // Build the unique filename from the file object
  // since Cloudinary doesnt give it to us
  const ext = path.extname(file.url)
  const storedFilename = _.last(file.public_id.split('/')) + ext
  const derivedFolder = file.public_id.split('/')[0]
  return _.merge({
    altText: file.originalname,
    original: {
      filename: storedFilename,
      folders: [derivedFolder],
      path: `${derivedFolder}/${storedFilename}`,
      bucket: process.env.AWS_S3_BUCKET,
      meta: {
        width: file.width,
        height: file.height,
        size: file.size,
        mimeType: file.mimetype
      }
    }
  }, options)
}
