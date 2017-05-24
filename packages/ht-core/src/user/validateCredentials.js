import Promise from 'bluebird'
import getUser from './getUser'

export default function validateCredentials(username, password) {
  return getUser({username})
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('User not found'))
      }
      return user.comparePassword(password)
    })
}
