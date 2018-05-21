import Promise from 'bluebird'
import {Follower, Guide} from '../models'


export default function getUserFeedGuides(userId) {
  return Follower.getUserFollowingIds(userId) // this refers to both categories and other users
  .then(followingIds => {
    return Guide.getUserFeedGuides(userId, followingIds)
  })

}
