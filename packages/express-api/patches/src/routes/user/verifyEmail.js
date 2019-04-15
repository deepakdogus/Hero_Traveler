import {Models} from '@hero/ht-core'

export default function verifyEmail(req) {

  if (req.user.isEmailVerified) {
    return Promise.resolve({ok: true})
  }

  return Models.User.findOne({_id: req.user._id})
    .then(user => {
      if (user.emailConfirmationToken === req.params.token) {
        user.isEmailVerified = true
        user.emailConfirmationToken = undefined
        return user.save()
      } else {
        return Promise.reject(new Error('Invalid token'))
      }
    })
}
