import Promise from 'bluebird'
import {Follower, Story} from '../models'

export default function getUserFeed(userId) {
  return Follower.getUserFollowingIds(userId)
  .then(followingIds => {
    return Story.getUserFeed(userId, followingIds)
  })
}
