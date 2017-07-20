import {User, Models} from '@rwoody/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default function updateCover(req, res, next) {
  const userId = req.user._id
  const file = req.file
  const folder = process.env.ASSETS_COVERS_FOLDER
  return Models.Image.create(
    formatUploadObject(
      file,
      folder,
      {purpose: 'userCover'}
    )
  )
  .then(image => {
    return Models.User.update({_id: userId}, {
      $set: {
        'profile.cover': image._id
      }
    })
  })
  .then(() => {
    return User.get(userId)
  })
}
