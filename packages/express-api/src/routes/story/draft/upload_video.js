import sharp from 'sharp'
import knox from 'knox'
import uuid from 'uuid'
import {StoryDraft, Models} from '@rwoody/ht-core'

// const client = knox.createClient({
//   key: process.env.AWS_ACCESS_KEY,
//   secret: process.env.AWS_SECRET_KEY,
//   bucket: process.env.AWS_S3_BUCKET
// })

export default function uploadDraftMedia(req, res, next) {
  const userId = req.user._id
  const draftId = req.params.id
  const file = req.file

  return Models.Video.create({
    user: userId,
    purpose: 'cover',
    original: {
      filename: file.originalname,
      path: file.key,
      bucket: process.env.AWS_S3_BUCKET,
      meta: {
        mimeType: file.mimetype,
        size: file.size,
      }
    }
  })
  .then(video => {
    return StoryDraft.update(draftId, {
      coverVideo: video._id
    })
  })
  .then(() => {
    return StoryDraft.get(draftId)
  })
}
