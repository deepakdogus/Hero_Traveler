import {Story} from '@hero/ht-core'
import removeStreamlessStories from '../../utils/removeStreamlessStories'

export default function getUserFeed(req, res) {
  const userId = req.user._id
  const page = parseInt(req.query.page, 10);
  const perPage = parseInt(req.query.perPage, 10);
  Story.getUserFeed(userId, page, perPage)
    .then(removeStreamlessStories)
    .then( data => {
      res.json(data)
    });
}
