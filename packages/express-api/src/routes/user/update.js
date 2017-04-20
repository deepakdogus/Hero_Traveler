import {Models} from '@rwoody/ht-core'
import {Constants} from '@rwoody/ht-util'

export default function updateUser(req) {
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
}