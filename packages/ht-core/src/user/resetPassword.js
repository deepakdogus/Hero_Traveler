import {User} from '../models'
import {resetPasswordEmail} from '../utils/emailService'

export default function resetPassword(email) {
  return User.find({ email: email})
  .then((registeredUser) => {
    console.log("registeredUser in HT-core: ", registeredUser)
    if (registeredUser){
    // resetPasswordEmail(email)
    return registeredUser
  } else {
    //handle error
  }
    
  })
}