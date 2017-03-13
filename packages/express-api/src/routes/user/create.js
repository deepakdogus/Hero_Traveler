import {User} from 'ht-core'

// Create the user and generate auth tokens
export default function createUser(req, res) {
  const user = req.body
  return User.create(user)
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
