import {Follower} from '../models'

export default function getCategories(userId) {
  return Follower.getUserCategories(userId)
}
