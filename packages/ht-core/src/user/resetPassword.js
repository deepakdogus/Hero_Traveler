import {User} from '../models'
import {resetPasswordEmail} from '../utils/emailService'
import uuid from 'uuid'

export default function resetPassword(email) {
  return User.findOne({ email: email})
  .then((user) => {
    // Return if we didn't find the email address
    if (!user) {
      return
    }

    user.passwordResetToken = uuid()
    return user.save()
    .then(user => {
      console.log('user has token', user)
      return resetPasswordEmail(user)
    })
    .then(() => {
      return user
    })
  })
}