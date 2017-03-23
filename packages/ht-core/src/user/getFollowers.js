import {Follower} from '../models'

export default function getFollowers(userId) {
  return Follower.getUserFollowers(userId)
}
