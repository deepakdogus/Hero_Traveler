
import {User} from '@hero/ht-core'

// Create the user and generate auth tokens
export default function changePassword (req) {
  return User.changePassword(req.body.userId, req.body.oldPassword, req.body.newPassword)
}
