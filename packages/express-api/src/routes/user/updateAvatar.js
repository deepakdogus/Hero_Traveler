import {User, Models} from '@hero/ht-core'
import {Constants, algoliaHelper} from '@hero/ht-util'
import HTUtil from '@hero/ht-util'

import formatUploadObject from '../../utils/formatUploadObject'

export default async function updateAvatar(req, res, next) {
  const userIdToUpdate = req.params.id
  let file = req.body.file

  if (!file) {
    await Models.User.update({_id: userIdToUpdate}, {
      $unset: {'profile.avatar': ''}
    })
  }
  else {
    if (typeof file === 'string') file = JSON.parse(req.body.file)
    const avatarImage = await Models.Image.create(
      formatUploadObject(
        file,
        {purpose: 'avatar'}
      )
    )

    await Models.User.update({_id: userIdToUpdate}, {
      $set: {
        'profile.avatar': avatarImage._id
      }
    })
  }

  return User.get({_id: userIdToUpdate})
  .then(user => {
    algoliaHelper.updateUserIndex(user)
    return user
  })
}

