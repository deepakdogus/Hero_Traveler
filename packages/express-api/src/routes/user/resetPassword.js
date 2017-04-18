import {User} from '@rwoody/ht-core'

// Create the user and generate auth tokens
export default function resetPassword(req, res) {
  return User.resetPassword(req.body.email)
}