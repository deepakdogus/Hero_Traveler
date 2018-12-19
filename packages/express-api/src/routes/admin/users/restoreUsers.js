import {User} from '@hero/ht-core'

const restoreUser = async(username) => {
  const userPromise = User.get({username})

  return userPromise
  .then((user) => {
    user.isDeleted = false
    return user.save()
  });
}

export default function restoreUsers(req, res) {
  const usernames = req.body.usernames
  const restoreTasks = usernames.map(i => restoreUser(i))
  return Promise.all(restoreTasks)
}
