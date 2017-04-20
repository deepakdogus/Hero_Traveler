import {User} from '../models'

export default function getUser(query, options) {
  return User.findOne(query)
             .populate('profile.avatar')
             .populate('profile.cover')
}
