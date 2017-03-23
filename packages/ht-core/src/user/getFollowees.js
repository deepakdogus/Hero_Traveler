import {Follower} from '../models'

export default function getFollowees(userId) {
  return Follower.getUserFollowees(userId)
}
