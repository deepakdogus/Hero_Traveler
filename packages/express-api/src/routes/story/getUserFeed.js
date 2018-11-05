import {Story} from '@hero/ht-core'

export default function getUserFeed(req, res) {
  const userId = req.user._id
  const page = parseInt(req.query.page, 10);
  const perPage = parseInt(req.query.perPage, 10);
  return Story.getUserFeed(userId, page, perPage)
}
