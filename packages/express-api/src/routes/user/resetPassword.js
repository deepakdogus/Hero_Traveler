import {User} from '@rwoody/ht-core'

// Create the user and generate auth tokens
export default function resetPassword(req, res) {
  const email = req.body.email
  console.log("email passed into API req.body: ", email)
  return User.resetPassword(email)
    .then(user => {
      return user ? console.log("registered user in API: ", user) : console.log("no registered user in API")
    })
}


// import {User} from '@rwoody/ht-core'

// export default function resetPassword(req) {
//   return User.resetPassword(req.body.email)
// }