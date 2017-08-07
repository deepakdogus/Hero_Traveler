import {User, Models} from '@hero/ht-core'
import algoliasearchModule from 'algoliasearch'
import formatUploadObject from '../../utils/formatUploadObject'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const userIndex = client.initIndex(process.env.ALGOLIA_USER_INDEX)

const addAvatarToIndex = (avatarImage, user) => new Promise((resolve, reject) => {
  const indexObject = {
    objectID: user._id,
    profile: {
      fullName: user.profile.fullName,
      avatar: avatarImage
    },
    username: user.username,
  }
  userIndex.partialUpdateObject(indexObject, (err, content) => {
    if (err) return reject(err)
    return resolve(content)
  })

})

export default async function updateAvatar(req, res, next) {
  const user = req.user
  const file = req.file
  const folder = process.env.ASSETS_AVATARS_FOLDER
  const avatarImage = await Models.Image.create(
    formatUploadObject(
      file,
      folder,
      {purpose: 'avatar'}
    )
  )
  await addAvatarToIndex(avatarImage, user)

  await Models.User.update({_id: user.id}, {
    $set: {
      'profile.avatar': avatarImage._id
    }
  })
  return User.get({_id: user.id})
}

