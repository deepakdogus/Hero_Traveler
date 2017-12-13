import {User} from '@hero/ht-core'

// Create the user and generate auth tokens
export default function resetPasswordRequest(req, res) {
	console.log('This should contain the email', req.body.email)
  return User.resetPasswordRequest(req.body.email)
}
