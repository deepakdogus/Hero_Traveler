import {Story} from '@hero/ht-core'

export default function getUserFeed(req, res) {
    const userId = req.user._id
    Story.getUserFeed(userId).then( data => {
      res.json(data)
    });
}
