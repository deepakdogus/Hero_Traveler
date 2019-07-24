import {User, Follower, ActivityFollow} from '../models'

// called when userId follows followeeUserId
export default function followUser(userId, followeeUserId) {
  return Follower.findOne({follower: userId, followee: followeeUserId})
    .then((following) => {
      if (following) throw new Error('You already follow the user')
      return Follower.followUser(userId, followeeUserId)
        .then(() => {
          return [
            User.findOneAndUpdate({
              _id: userId
            }, {
              $inc: {'counts.following': 1}
            }, {new: true}),
            User.findOneAndUpdate({
              _id: followeeUserId
            }, {
              $inc: {'counts.followers': 1}
            }, {new: true})
          ]
        })
        .spread((user, followedUser) => {
          return ActivityFollow.add(followeeUserId, userId)
            .then(({isNew}) => {
              return Promise.resolve({user, followedUser, notify: isNew})
            })
        })
    })
}
