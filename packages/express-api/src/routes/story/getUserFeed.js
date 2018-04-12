import {Story} from '@hero/ht-core'
import removeStreamlessStories from '../../utils/removeStreamlessStories'

export default function getUserFeed(req, res) {
    const userId = req.user._id
    Story.getUserFeed(userId)
    .then(removeStreamlessStories)
    .then( data => {
      res.json(data)
    });
}
