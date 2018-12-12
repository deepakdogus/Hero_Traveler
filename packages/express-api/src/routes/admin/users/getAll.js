import {User} from '@hero/ht-core'

export default function getAll(req, res) {
  return User.list()
  .then(data => {
    res.json(data)
  })
}
