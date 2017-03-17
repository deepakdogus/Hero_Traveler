import Models from '../models'

export default function getUser(query) {
  return Models.User.findOne(query)
}
