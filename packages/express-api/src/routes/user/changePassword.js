
import {User} from '@rwoody/ht-core'

// Create the user and generate auth tokens
export default function changePassword (req) {
  console.log('req.body', req.body)
  return User.changePassword(req.body.userId, req.body.newPassword)
}
