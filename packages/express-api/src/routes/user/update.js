import {User, Models} from '@hero/ht-core'
import {Constants} from '@hero/ht-util'
import algoliasearchModule  from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const userIndex = client.initIndex(process.env.ALGOLIA_USER_INDEX)

const updateUserIndex = (attrs, userId) => new Promise((resolve, reject) => {
  const indexObject = { objectID: userId,
                        username: attrs.username
                      }

  userIndex.partialUpdateObject(indexObject, (err, content) => {
    if (err) reject(err)
    return resolve(content)
  })
})

export default async function updateUser(req) {
  const attrs = Object.assign({}, req.body)
  const userIdToUpdate = req.params.id
  const userId = req.user._id
  const isAdmin = Constants.USER_ROLES_ADMIN_VALUE === req.user.role

  // Only admins can change role
  if (!isAdmin) {
    delete attrs.role
  }

  if (!userId.equals(userIdToUpdate) && !isAdmin) {
    return Promise.reject(new Error('Unauthorized'))
  }
  await updateUserIndex(attrs, userId)

  return Models.User.findOne({username: req.body.username})
  .then(queryResponse => {
    if (queryResponse && userIdToUpdate != queryResponse._id) {
      // We have another user that has this username
      return Promise.reject(Error("This username is taken"));
    } else {
      return Models.User.update({_id: userIdToUpdate}, attrs)
      .then(() => {
        return User.get({_id: userIdToUpdate})
      });
    }
  });
}
