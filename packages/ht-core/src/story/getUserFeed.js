import Promise from 'bluebird'
import {Follower, Story} from '../models'

/*
corresponds to 'Posts.getTopFiveGlobal' & 'Posts.userFeed' in the meteor repository
- gets top five stories
- and stories from people the user is following
 */
export default function getUserFeed(userId) {
  return Follower.getUserFollowingIds(userId)
  .then(followingIds => {
    return Story.getUserFeed(userId, followingIds)
  })
}
