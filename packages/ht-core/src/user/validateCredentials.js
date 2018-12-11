import Promise from 'bluebird'
import getUser from './getUser'

export default function validateCredentials(userIdentfier, password) {
  return getUser({
    $or: [
      { username: userIdentfier },
      { email: userIdentfier },
    ]
  })
  .then(user => {
    console.log('user got ', user)
    if (!user) {
      return Promise.reject(new Error('User not found'))
    }
    return user.comparePassword(password)
  })
}
