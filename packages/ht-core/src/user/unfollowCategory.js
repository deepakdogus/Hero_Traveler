import {Category, Follower} from '../models'

// called when userId follows categoryId
export default function followCategory(userId, categoryId) {
  return Follower.update({
    follower: userId,
    followee: categoryId,
  }, {
    endAt: Date.now()
  })
  .then(() => {
    return Category.update({
      _id: categoryId
    }, {
      $inc: {'counts.following': -1}
    })
  })
}
