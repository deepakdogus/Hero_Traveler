import {Models} from '@hero/ht-core'
import Promise from 'bluebird'

// check for unique properties of signup
export default function signupCheck(req, res) {
  const {username, email} = req.body
  return Promise.props({
    username: Models.User.findOne({username}),
    email: Models.User.findOne({email}),
  }).then(queryResponse => {
    return {
      username: !!queryResponse.username,
      email: !!queryResponse.email,
    }
  })
}
