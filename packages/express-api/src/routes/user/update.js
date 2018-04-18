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

  let attrsBlacklist = ["email", "password", "passwordResetToken"];

  // Only admins can change role
  if (!isAdmin) {
    attrsBlacklist.push("role");
  }

  let userPromise = Promise.resolve(req.user);
  
  if (!userId.equals(userIdToUpdate)) {
    if (!isAdmin) {
      // Only admins can modify other users
      return Promise.reject(new Error('Unauthorized'));
    }
    userPromise = Models.User.findOne({_id: req.params.id});
  }

  return userPromise.then((user) => {
    for (let key in attrs) {
      if (attrsBlacklist.indexOf(key) < 0) {
        user[key] = attrs[key];
      }
    }
  
    return user.save().then(async () => {
      await updateUserIndex(attrs, userId);
      return user;
    }).catch((err) => {
      if (
        err && 
        (err.code && err.code === 11000) ||
        (err.message && err.message.indexOf("username already taken") != -1)
      ) {
        return Promise.reject(Error("This username is taken"));
      } else {
        return Promise.reject(Error("User could not be updated"));
      }
    });
  });
}
