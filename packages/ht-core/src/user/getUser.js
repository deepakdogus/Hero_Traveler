import { User } from '../models'

const HIDDEN_USER_FIELDS = ['gender', 'locationInfo', 'birthday']

export default function getUser(query, shouldDisplay = false) {
  const searchParams = HIDDEN_USER_FIELDS.map(
    param => `${shouldDisplay ? '+' : '-'}${param}`,
  ).join(' ')
  return User.findOne(query)
    .select(searchParams.slice(0, searchParams.length - 1))
    .populate('profile.avatar')
    .populate('profile.cover')
}
