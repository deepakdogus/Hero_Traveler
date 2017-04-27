import sharp from 'sharp'
import knox from 'knox'
import uuid from 'uuid'
import {StoryDraft, Models} from '@rwoody/ht-core'

export default function uploadDraftImage(req, res, next) {
  // const userId = req.user._id
  // const draftId = req.params.id
  const file = req.file

  return Models.Image.create({
    // user: userId,
    altText: file.originalname,
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
  // .then(image => {
  //   return StoryDraft.update(draftId, {
  //     coverImage: image._id
  //   })
  // })
  // .then(() => {
  //   return StoryDraft.get(draftId)
  // })
}
