import {User, Models} from '@rwoody/ht-core'

const {ACCOUNT_TYPE_FACEBOOK} = Models.User

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
