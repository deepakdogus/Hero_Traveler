import {User} from '../models'

export default function resetPassword(token, password) {
  return User.findOne({passwordResetToken: token})
  .then((user) => {
    if (!user) {
      return Promise.reject(new Error('Token has expired'))
    }

    return user.updatePassword(password)
      .then(() => {
        return Promise.resolve({ok: true})
      })
  })
}
