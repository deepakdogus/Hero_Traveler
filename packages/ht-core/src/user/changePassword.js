import {User} from '../models'

export default function changePassword (userId, oldPassword, newPassword) {
  return User.findById(userId)
  .then((user) => {
    if (!user) {
      return Promise.reject(new Error('User Not Found!'))
    }
    return user.comparePassword(oldPassword)
    .then(user => {
      return user.updatePassword(newPassword)
    })
    .then(() => {
      return Promise.resolve({ok: true})
    })
  })
}
