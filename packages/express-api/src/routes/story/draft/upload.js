import sharp from 'sharp'
import knox from 'knox'
import uuid from 'uuid'
import {StoryDraft} from '@rwoody/ht-core'

const client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_S3_BUCKET
})

const resizer = sharp()
  .resize(750, 1334)

export default function uploadDraftMedia(req, res, next) {
  const draftId = req.params.id
  const file = req.file

  return new Promise((resolve, reject) => {
    client.getFile(file.key, (err, originalImage) => {
      if (err) {
        return reject(err)
      }

      const contentType = originalImage.headers['content-type']
      const contentLength = originalImage.headers['content-length']
      const newVersionName = `${uuid()}-mobile-${file.originalname}`
      const newVersionKey = `${process.env.AWS_ASSETS_FOLDER}/${newVersionName}`
      client.putStream(originalImage.pipe(resizer), newVersionKey, {
        'x-amz-acl': 'public-read',
        'content-type': contentType,
        'content-length': contentLength,
      }, (err, resp) => {
        if (err) {
          return reject(err)
        }

        return resolve({
          original: originalImage,
          cropped: Object.assign({}, resp, {newVersionName, newVersionKey})
        })
      })
    })
  }).then(({original, cropped}) => {
    return StoryDraft.update(draftId, {
      coverImage: {
        altText: file.originalname,
        original: {
          filename: file.originalname,
          path: file.key,
          bucket: process.env.AWS_S3_BUCKET,
          meta: {
            size: file.size,
            mimeType: file.mimetype
          }
        },
        versions: {
          mobile: {
            filename: cropped.newVersionName,
            path: cropped.newVersionKey,
            width: 750,
            height: 1334,
            meta: {
              mimeType: cropped.headers['content-type']
            }
          }
        }
      }
    })
  })

  

  

  // console.log('file', file)

  return StoryDraft.update(draftId, {
    coverImage: {
      altText: file.originalname,
      original: {
        filename: file.originalname,
        path: file.key,
        bucket: process.env.AWS_S3_BUCKET,
        // width: ,
        // height: ,
        meta: {
          size: file.size,
          mimeType: file.mimetype
        }
      }
    }
  }).then((draft) => {
    return file
  })
}
