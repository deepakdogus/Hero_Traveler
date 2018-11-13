import {User, Models, Story} from '@hero/ht-core'
import {Constants, algoliaHelper} from '@hero/ht-util'
import _ from 'lodash'

function hasNewUsername(user, attrs) {
  return attrs.username && user.username !== attrs.username
}

function getShouldUpdateAlgolia(user, attrs) {
  return hasNewUsername(user, attrs)
  || (attrs.profile && _.get(user, 'profile.avatar.id') !== _.get(attrs, 'profile.avatar.id'))
}

export default async function updateUser(req) {
  const attrs = Object.assign({}, req.body)
  const userIdToUpdate = req.params.id
  const userId = req.user._id
  const isAdmin = Constants.USER_ROLES_ADMIN_VALUE === req.user.role

  let attrsBlacklist = ["password", "passwordResetToken"];

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
    userPromise = User.get({_id: req.params.id})
  }

  return userPromise
  .then((user) => {
    // need to check if should update before mutating user
    const shouldReindexUser = getShouldUpdateAlgolia(user, attrs)
    const shouldReindexUsersStories = hasNewUsername(user, attrs)

    if (hasNewUsername(user, attrs)) {
      user.usernameIsTemporary = false;
    }

    for (let key in attrs) {
      if (attrsBlacklist.indexOf(key) < 0) {
        if (key.indexOf('profile.') == 0) {
          user.profile[key.slice('profile.'.length)] = attrs[key];
        } else {
          user[key] = attrs[key];
        }
      }
    }

    return user.save().then(user => {
      if (shouldReindexUser) algoliaHelper.updateUserIndex(user)
      if (shouldReindexUsersStories) {
        Story.getUserStories(user.id)
        .then(algoliaHelper.updateMultipleStories)
      }
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
