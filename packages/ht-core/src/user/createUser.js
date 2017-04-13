import joi from 'joi'
import {User} from '../models'
import encryptPassword from '../utils/encryptPassword'
import {welcomeEmail} from '../utils/emailService'
import getOrCreateTokens from './getOrCreateTokens'
import uuid from 'uuid'

import algoliasearchModule from 'algoliasearch'

require('dotenv').config()

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)

const userIndex = client.initIndex('dev_USERS')


// converting algoliasearch callback api to promise

const addUserToIndex = (user) => new Promise((resolve, reject) => {
  userIndex.addObject(user, (err, content) => {
    if (err) reject(err)
    if (content) resolve(content)
  })
})



export default function createUser(userData) {
	let userAttrs = Object.assign({}, userData)

  // @TODO validate user

  return encryptPassword(userAttrs.password)
  .then(hashedPassword => {
    userAttrs.password = hashedPassword
    // @TODO use json web tokens
    userAttrs.emailConfirmationToken = uuid()
    return User.create(userAttrs)
  })
    .then(newUser => {
      addUserToIndex(newUser)
      return newUser
    })
  .then(newUser => {
    welcomeEmail(newUser)
    return newUser;
  })
    .catch(err => console.error(err))
}
