import path from 'path'
import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import uuid from 'uuid'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

export default multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    cacheControl: 'max-age=31536000',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      // console.log('metadata', file)
      cb(null, {
        fieldName: file.fieldname
      })
    },
    key(req, file, cb) {
      cb(null, path.join(
        process.env.AWS_ASSETS_FOLDER || 'files',
        `${uuid()}-${file.originalname}`
      ))
    }
  })
})