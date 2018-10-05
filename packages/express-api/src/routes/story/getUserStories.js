import {Story} from '@hero/ht-core'
import removeStreamlessStories from '../../utils/removeStreamlessStories'

export default function getUserStories(req, res) {
  return Story.getUserStories(req.params.userId)
  .then(stories => {
    if (req.user && req.params.userId === req.user.id) return stories
    return removeStreamlessStories(stories)
  })
  .then(data => {
    res.json(data)
  })
}
