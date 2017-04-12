import {User} from '@rwoody/ht-core'

// Create the user and generate auth tokens
export default function resetPassword(req, res) {
  return User.resetPassword(req.body.email)
    .then(user => {
    //TODO update handling of unregistered user
      return user ? console.log("registered user in API: ", user) : console.log("no registered user in API")
    })
}