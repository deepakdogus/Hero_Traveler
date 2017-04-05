import joi from 'joi'
import {User} from '../models'
import encryptPassword from '../utils/encryptPassword'
import sendEmail from '../utils/sendEmail'
import getOrCreateTokens from './getOrCreateTokens'

export default function createUser(userData) {
  let userAttrs = Object.assign({}, userData)

  // @TODO validate user

  return encryptPassword(userAttrs.password)
    .then(hashedPassword => {
	
    //test email content
	const msgSubject = "Wecome to Hero Traveler!",
		msgContent = "Here's a heroic welcome message?"
	sendEmail(userAttrs.profile.fullName, userAttrs.username, userAttrs.email, msgSubject, msgContent)

      userAttrs.password = hashedPassword
      console.log("userAttrs: ", userAttrs)
      return User.create(userAttrs)
    })
}
