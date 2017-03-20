import {Story} from '@rwoody/ht-core'

export default function getUserFeed(req, res) {
    let { id: userId } = req.query;
    Story.getUserFeed(userId).then( data => {
      res.json(data)
    });
}
