import Promise from 'bluebird'
import bcrypt from 'bcrypt'
import getUser from './getUser'

const comparePassword = Promise.promisify(bcrypt.compare)

export default function validateCredentials(username, password) {
  return getUser({username})
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('User not found'))
      }
      return user.comparePassword(password)
    })
}
