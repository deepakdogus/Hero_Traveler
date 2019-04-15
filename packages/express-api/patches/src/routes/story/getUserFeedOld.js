import {Story} from '@hero/ht-core'

export default function getUserFeedOld(req, res) {
  const userId = req.user._id
  return Story.getUserFeed(userId)
  .then( data => data.feed)
}
