import {User} from '../models'

const HIDDEN_USER_FIELDS = ['gender', 'locationInfo', 'birthday']

export default function getUser(query, options = false) {
  const searchParams = HIDDEN_USER_FIELDS.reduce((acc, ele) => {
    return acc + (options ? '+' : '-') + ele + ' '
  }, '')
  return User.findOne(query)
             .select(searchParams.slice(0, searchParams.length-1))
             .populate('profile.avatar')
             .populate('profile.cover')
}
