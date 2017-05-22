import sharp from 'sharp'
import knox from 'knox'
import uuid from 'uuid'
import {StoryDraft, Models} from '@rwoody/ht-core'

// const client = knox.createClient({
//   key: process.env.AWS_ACCESS_KEY,
//   secret: process.env.AWS_SECRET_KEY,
//   bucket: process.env.AWS_S3_BUCKET
// })

const resizer = sharp()
  .resize(750, 1334)

export default function uploadDraftMedia(req, res, next) {
  const userId = req.user._id
  const draftId = req.params.id
  const file = req.file

  return Models.Image.create({
    user: userId,
    altText: file.originalname,
    purpose: 'cover',
    original: {
      filename: file.originalname,
      path: file.key,
      bucket: process.env.AWS_S3_BUCKET,
      meta: {
        size: file.size,
        mimeType: file.mimetype
      }
    }
  })
  .then(image => {
    return StoryDraft.update(draftId, {
      coverImage: image._id
    })
  })
}
