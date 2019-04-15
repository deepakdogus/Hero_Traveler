import {User} from '@hero/ht-core'

// Create the user and generate auth tokens
export default function createUser(req, res) {
  const {user, deviceId} = req.body
  return User.create(user, deviceId)
    .then(user => {
      return User.getOrCreateTokens(user._id)
        .then(({tokens}) => {
          return {
            user,
            tokens
          }
        })
    })
}
