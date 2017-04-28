import {User} from '../models'

export default function findUsers(query) {
  return User.find(query)
             .sort({'counts.followers': 1})
}
