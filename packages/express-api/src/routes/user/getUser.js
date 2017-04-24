import {Models} from '@rwoody/ht-core'

export default function getUser(req, res) {
  return Models.User.findOne({
    _id: req.params.id
  })
}