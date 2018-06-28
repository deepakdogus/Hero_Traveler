import {Models, Story} from '@hero/ht-core'
import {Constants, algoliaHelper} from '@hero/ht-util'

// Soft delete a user
export default function deleteUser(req, res) {
  const userIdToDelete = req.params.id
  const userId = req.user._id
  const isAdmin = Constants.USER_ROLES_ADMIN_VALUE === req.user.role

  let userPromise = Promise.resolve(req.user);

  if (!userId.equals(userIdToDelete)) {
    if (!isAdmin) {
      // Only admins can modify other users
      return Promise.reject(new Error('Unauthorized'));
    }
    userPromise = Models.User.findOne({_id: req.params.id});
  }

  return userPromise.then((user) => {
    let result = user.delete();
    algoliaHelper.updateUserIndex(user)
    Story.getUserStories(user.id)
    .then(algoliaHelper.updateMultipleStories)
    return result;
  });
}
