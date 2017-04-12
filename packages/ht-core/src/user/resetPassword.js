import {User} from '../models'
import {resetPasswordEmail} from '../utils/emailService'

export default function resetPassword(email) {
  return User.find({ email: email})
  .then((registeredUser) => {
    if (registeredUser){

    //TODO generate token for email link back to re-set password UI
    resetPasswordEmail(registeredUser[0], 'xyz')
    return registeredUser
  } else {
    //handle unregistered user error
  }
    
  })
}