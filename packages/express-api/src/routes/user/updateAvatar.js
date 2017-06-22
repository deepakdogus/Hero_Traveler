import sharp from 'sharp'
import knox from 'knox'
import uuid from 'uuid'
import {User, Models} from '@rwoody/ht-core'
import algoliasearchModule from 'algoliasearch'

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
  const userId = req.user._id
  const user = req.user
  const file = req.file

  const avatarImage = await Models.Image.create({
    user: userId,
    purpose: 'avatar',
    altText: file.originalname,
    original: {
      filename: file.originalname,
      path: file.key,
      bucket: process.env.AWS_S3_BUCKET,
      meta: {
        size: file.size,
        mimeType: file.mimetype
      }
    }
  })
  await addAvatarToIndex(avatarImage, user)

  await Models.User.update({_id: userId}, {
    $set: {
      'profile.avatar': avatarImage._id
    }
  })
  return User.get(userId)
}

