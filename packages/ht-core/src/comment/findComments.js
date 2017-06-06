import {Comment} from '../models'

export default function findComments(storyId) {
  return Comment.find({story: storyId})
    .sort('createdAt')
    .populate({
    	path: 'user',
    	populate: { path: 'profile.avatar' }
    })
}
