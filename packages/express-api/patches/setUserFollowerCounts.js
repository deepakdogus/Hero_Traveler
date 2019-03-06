import {Models} from '@hero/ht-core'

export default function indexUsers() {
  return Models.User.find({})
  .then(users => {
    return Promise.all(users.map(user => {
      return Models.Follower.find({
        followee: user.id,
        type: "User",
      })
      .then(followersList => {
        const followersById = {}
        return Promise.all(followersList.map(follow => {
          const follower = follow.follower
          if (!followersById[follower]) {
            followersById[follower] = true
            return follow
          }
          console.log("going to delete followee", follower, user.id)
          return follow.remove()
        }))
      })
      .then(() => {
       return Models.Follower.find({
          follower: user.id,
          type: "User",
        })
      })
      .then(followingList => {
        const followingById = {}
        return Promise.all(followingList.map(follow => {
          const followee = follow.followee
          if (!followingById[followee]) {
            followingById[followee] = true
            return follow
          }
          console.log("going to delete following", followee, user.id)
          return follow.remove()
        }))
      })
      .then(() => {
        return Models.Follower.getUserFollowees(user.id)
      })
      .then(followers => {
        user.counts.followers = followers.length
        return Models.Follower.getUserFollowers(user.id)
        .exec()
      })
      .then(following => {
        user.counts.following =  following.length
        return user.save()
      })
    }))
  })
  .then(() => console.log("finished patch"))
}
