import {Story} from '@hero/ht-core'

export default function getUserStories(req, res) {
  return Story.getUserStories(req.params.userId).then(data => {
    res.json(data)
  })
}
