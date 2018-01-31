import Promise from 'bluebird'
import {Follower, Story} from '../models'


export default function getUserFeed(userId) {
  return Follower.getUserFollowingIds(userId) // this refers to both categories and other users
  .then(followingIds => {
    return Story.getUserFeed(userId, followingIds)
  })

}
