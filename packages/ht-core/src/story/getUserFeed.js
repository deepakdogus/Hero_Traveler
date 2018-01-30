import Promise from 'bluebird'
import {Follower, Story} from '../models'

export default async function getUserFeed(userId) {
	try {
		const [followingIds, categoryIds] = await Promise.all([ Follower.getUserFollowingIds(userId), Follower.getUserCategories(userId) ])
		console.log('fol', followingIds)
		console.log('cate', categoryIds)
		return Story.getUserFeed(userId, followingIds, categoryIds)
	} catch(e) {
		console.log('Trouble')
	}
}
