import { Story } from '@hero/ht-core'

export default async function getNearbyFeed(req, res) {
  const nearbyStoryIds = JSON.parse(req.query.nearbyStoryIds)
  // @TODO: incorporate pages for infinite scroll if >100 nearby results desired
  // const page = parseInt(req.query.page, 10)
  // const perPage = parseInt(req.query.perPage, 10)

  // ensure stories are returned in closest-to-farthest order (the way they were sent)
  const sortByIdPosition = (a, b) =>
    nearbyStoryIds.indexOf(a.id) > nearbyStoryIds.indexOf(b.id)
  const nearbyStories = await Story.getStoriesById(nearbyStoryIds)
  return {
    ...nearbyStories,
    feed: nearbyStories.feed.sort(sortByIdPosition),
  }
}
