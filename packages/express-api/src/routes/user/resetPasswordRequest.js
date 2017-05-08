import {User} from '@rwoody/ht-core'

// Create the user and generate auth tokens
export default function resetPasswordRequest(req, res) {
  return User.resetPasswordRequest(req.body.email)
}
