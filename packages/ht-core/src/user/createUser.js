import _ from 'lodash'
import Promise from 'bluebird'
import {Constants, algoliaHelper} from '@hero/ht-util'

import {User, UserDevice} from '../models'
import {welcomeEmail} from '../utils/emailService'

const {
  ACCOUNT_TYPE_EMAIL,
  ACCOUNT_TYPE_FACEBOOK,
  ACCOUNT_TYPE_TWITTER
} = User

export async function createUserFacebook(facebookUserData, device: ?object) {
  const {
    fbid,
    email,
    name,
    pictureUrl
  } = facebookUserData
  const existingUser = await User.findOne({email: facebookUserData.email})

  // The user already has an account with us,
  // and has NOT signed up with facebook
  if (existingUser && !existingUser.hasFacebookAccountInfo()) {
    const updatedUser = await existingUser.connectFacebook(fbid)
    return Promise.resolve([updatedUser, true])
  }

  // The user already has an account with us,
  // and has already signed up with facebook
  if (existingUser && existingUser.hasFacebookAccountInfo()) {
    return Promise.resolve([existingUser, true])
  }

  const newUser = await User.createFromFacebookData(
    fbid,
    email,
    name,
    pictureUrl
  )

  if (!!device) {
    const userDevice = await UserDevice.addOrUpdate(
      device,
      newUser._id,
    )
  }

  return Promise.all([
    algoliaHelper.addUserToIndex(newUser),
    welcomeEmail(newUser)
  ])
  .then(() => Promise.resolve([newUser, false]))
}

// @TODO validate user
export default function createUser(userData, device: ?object) {
  return User.createFromEmailData(
    userData.name,
    userData.email,
    userData.username,
    userData.password,
    !!device
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
    algoliaHelper.addUserToIndex(newUser)
    welcomeEmail(newUser)
    return newUser;
  })
}
