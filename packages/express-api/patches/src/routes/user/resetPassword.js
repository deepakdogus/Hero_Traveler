import {User} from '@hero/ht-core'

// Create the user and generate auth tokens
export default function resetPassword(req) {
  return User.resetPassword(req.body.token, req.body.password)
}
