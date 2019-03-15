import {User} from '@hero/ht-core'

const restoreUser = async(id) => {
  return User.restoreUser(id)
}


export default function restoreUsers(req, res) {
  const ids = req.body.ids
  const restoreTasks = ids.map(i => restoreUser(i))
  return Promise.all(restoreTasks)
}
