import {User} from '../models'

export default function changePassword (userId, password) {
  console.log('id', userId)
  console.log('password', password)
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('User Not Found!'))
      }

      return user.updatePassword(password)
        .then(() => {
          return Promise.resolve({ok: true})
        })
    })
    .catch(error => console.error('Error!', error))
}
