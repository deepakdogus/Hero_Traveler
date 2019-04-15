import {Story} from '@hero/ht-core'

export default function getNearbyFeed(req, res) {
  const nearbyStoryIds = JSON.parse(req.query.nearbyStoryIds)
  // @TODO: incorporate pages for infinite scroll if >100 nearby results desired
  // const page = parseInt(req.query.page, 10)
  // const perPage = parseInt(req.query.perPage, 10)
  return Story.getStoriesById(nearbyStoryIds)
}
