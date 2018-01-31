const path = require('path')
const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const uuid = require('uuid')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

module.exports = multer({
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
