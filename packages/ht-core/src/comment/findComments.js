import {Comment} from '../models'

export default function findComments(params) {
  return Comment.find(params)
    .sort('createdAt')
    .populate({
    	path: 'user',
    	populate: { path: 'profile.avatar' }
    })
}
