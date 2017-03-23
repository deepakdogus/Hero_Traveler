import {Category, Follower} from '../models'

// called when userId follows categoryId
export default function followCategory(userId, categoryId) {
  return Follower.create({
    follower: userId,
    followee: categoryId,
    type: 'Category'
  })
  .then(() => {
    return Category.update({
      _id: categoryId
    }, {
      $inc: {'counts.following': 1}
    })
  })
}
