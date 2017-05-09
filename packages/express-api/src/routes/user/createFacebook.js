import {User, Models} from '@rwoody/ht-core'

// FACEBOOK Signup
// Create the user and generate auth tokens
export default function createUserFromFacebook(req, res) {
  const {user, deviceId} = req.body
  return User.createFacebook(user, deviceId)
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
