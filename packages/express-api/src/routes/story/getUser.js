import {Story} from '@rwoody/ht-core'

export default function getUserStories(req, res) {
  return Story.find({
    author: req.params.userId
  }).then(data => {
    res.json(data)
  })
}
