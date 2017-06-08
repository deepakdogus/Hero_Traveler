import sharp from 'sharp'
import knox from 'knox'
import uuid from 'uuid'
import {StoryDraft, Models} from '@rwoody/ht-core'

export default function uploadDraftImage(req, res, next) {
  const file = req.file

  return Models.Video.create({
    // user: userId,
    purpose: 'storyVideo',
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
}
