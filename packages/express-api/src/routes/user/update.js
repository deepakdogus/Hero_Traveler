import {User, Models} from '@hero/ht-core'
import {Constants, algoliaHelper} from '@hero/ht-util'

export default async function updateUser(req) {
  const attrs = Object.assign({}, req.body)
  const userIdToUpdate = req.params.id
  const userId = req.user._id
  const isAdmin = Constants.USER_ROLES_ADMIN_VALUE === req.user.role

  // Only admins can change role
  if (!isAdmin) {
    delete attrs.role
  }

  if (!userId.equals(userIdToUpdate) && !isAdmin) {
    return Promise.reject(new Error('Unauthorized'))
  }


  return Models.User.update({_id: userIdToUpdate}, attrs)
  .then(() => User.get({_id: userIdToUpdate}))
  .then(user => {
    // leaving as is until we get Emre refactor in
    if (req.user.username !== user.username) algoliaHelper.updateUserIndex(user)
    return user
  })
}
