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

  client.getFile(file.key, (err, originalImage) => {
    if (err) {
      next(err)
    }
  
    client.putStream(originalImage.pipe(resizer), '/rwoody_files/test-stream.jpg', {
      'x-amz-acl': 'public-read',
      'content-type': image.headers['content-type'],
      'content-length': image.headers['content-length'],
    }, (err, resp) => {
      if (err) {
        next(err)
        return
      }

      resp.pipe(res)
      return
    })
  })

  

  

  // console.log('file', file)

  // return StoryDraft.update(draftId, {
  //   coverImage: {
  //     altText: file.originalname,
  //     original: {
  //       filename: file.originalname,
  //       path: file.key,
  //       bucket: process.env.AWS_S3_BUCKET,
  //       // width: ,
  //       // height: ,
  //       meta: {
  //         size: file.size,
  //         mimeType: file.mimetype
  //       }
  //     }
  //   }
  // }).then((draft) => {
  //   return file
  // })
}
