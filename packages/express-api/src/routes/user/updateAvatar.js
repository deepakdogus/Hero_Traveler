import sharp from 'sharp'
import knox from 'knox'
import uuid from 'uuid'
import {User, Models} from '@rwoody/ht-core'

export default function updateAvatar(req, res, next) {
  const userId = req.user._id
  const file = req.file

  return Models.Image.create({
    user: userId,
    purpose: 'avatar',
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
  .then(image => {
    return Models.User.update({_id: userId}, {
      $set: {
        'profile.avatar': image._id
      }
    })
  })
  .then(() => {
    return User.get(userId)
  })
}
