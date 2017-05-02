import algoliasearchModule from 'algoliasearch'
import {Constants} from '@rwoody/ht-util'
import {User, UserDevice} from '../models'
import {welcomeEmail} from '../utils/emailService'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const userIndex = client.initIndex(process.env.ALGOLIA_USER_INDEX)

// converting algoliasearch callback api to promise
const addUserToIndex = (user) => new Promise((resolve, reject) => {
  // return early if we are not seeding
  if (process.env.DISABLE_ALGOLIA) {
    return resolve()
  }

  userIndex.addObject(user, (err, content) => {
    if (err) reject(err)
    if (content) resolve(content)
  })
})

const {
  ACCOUNT_TYPE_EMAIL,
  ACCOUNT_TYPE_FACEBOOK,
  ACCOUNT_TYPE_TWITTER
} = User

export function createUserFacebook(facebookUserData, device: ?object) {
  return User.createFromFacebookData(
    facebookUserData.fbid,
    facebookUserData.email,
    facebookUserData.name,
    facebookUserData.pictureUrl
  )
  .then(newUser => {
    if (!device) {
      return Promise.resolve(newUser)
    }

    return UserDevice.addOrUpdate(
      device,
      newUser._id,
    ).then(() => Promise.resolve(newUser))
  })
  .then(newUser => {
    addUserToIndex(newUser)
    welcomeEmail(newUser)
    return newUser
  })
}

// @TODO validate user
export default function createUser(userData, device: ?object) {
  return User.createFromEmailData(
    userData.name,
    userData.email,
    userData.username,
    userData.password
  )
  .then(newUser => {
    if (!device) {
      return Promise.resolve(newUser)
    }

    return UserDevice.addOrUpdate(
      device,
      newUser._id,
    ).then(() => Promise.resolve(newUser))
  })
  .then(newUser => {
    console.log('newUser', newUser)
    addUserToIndex(newUser)
    welcomeEmail(newUser)
    return newUser;
  })
}
