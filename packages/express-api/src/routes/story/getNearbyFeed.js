import { Story } from '@hero/ht-core'

export default async function getNearbyFeed(req, res) {
  const nearbyStoryIds = JSON.parse(req.query.nearbyStoryIds)
  // @TODO: incorporate pages for infinite scroll if >100 nearby results desired
  // const page = parseInt(req.query.page, 10)
  // const perPage = parseInt(req.query.perPage, 10)

  const nearbyStories = await Story.getStoriesById(nearbyStoryIds)
  return nearbyStories
}
