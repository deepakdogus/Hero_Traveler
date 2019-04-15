import {Story} from '@hero/ht-core'

export default function getNearbyFeed(req, res) {
  return Story.getBadgeUserStories()
}
