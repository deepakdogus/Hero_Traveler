import {User, Models} from '@hero/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default function updateCover(req, res, next) {
  const userId = req.user._id
  let file = req.body.file
  if (typeof file === 'string') file = JSON.parse(req.body.file)
  return Models.Image.create(
    formatUploadObject(
      file,
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
