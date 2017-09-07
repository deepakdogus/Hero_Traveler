import {User, Models} from '@hero/ht-core'

// FACEBOOK Signup
// Create the user and generate auth tokens
export default function createUserFromFacebook(req, res) {
  const {user, deviceId} = req.body
  return User.createFacebook(user, deviceId)
    .then(([user, wasSignedUp]) => {
      return User.getOrCreateTokens(user._id)
        .then(({user, tokens}) => {
          return {
            user,
            wasSignedUp,
            tokens
          }
        })
    })
}
