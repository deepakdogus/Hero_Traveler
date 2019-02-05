import _ from 'lodash'
import Promise from 'bluebird'
import {Constants, algoliaHelper} from '@hero/ht-util'

import {User, UserDevice, Image} from '../models'
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

  let query = [
    {"accounts.uid": fbid}
  ]

  if (!!email) {
    query.push({email});
  }

  const existingUser = await User.findOne({
    $or: query
  })

  let userToReturn
  // The user already has an account with us,
  // and has NOT signed up with facebook
  if (existingUser && !existingUser.hasFacebookAccountInfo()) {
    userToReturn = await existingUser.connectFacebook(fbid)
  }

  // The user already has an account with us,
  // and has already signed up with facebook
  else if (existingUser && existingUser.hasFacebookAccountInfo()) {
    userToReturn = existingUser
  }

  else {
    userToReturn = await User.createFromFacebookData(
      fbid,
      email,
      name
    )

    // upload the user's profile picture as an avatar here
    if (pictureUrl) {
      const avatarImage = await Image.create({
        original: {
          folders: ['facebook'],
          filename:`${fbid}.jpg`,
          path: `${fbid}.jpg`,
        },
        purpose: 'avatar'
      })

      await User.update({_id: userToReturn._id}, {
        $set: {
          'profile.avatar': avatarImage._id,
        }
      })
    }

    await Promise.all([
      algoliaHelper.addUserToIndex(userToReturn),
      welcomeEmail(userToReturn),
    ])
  }

  if (!!device) {
    const userDevice = await UserDevice.addOrUpdate(
      device,
      userToReturn._id,
    )
  }
  return Promise.resolve([userToReturn, !!existingUser])
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
    )
    .then(() => newUser)
  })
  .then(newUser => {
    algoliaHelper.addUserToIndex(newUser)
    welcomeEmail(newUser)
    return newUser;
  })
}
