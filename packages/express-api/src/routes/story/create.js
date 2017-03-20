import {Story} from '@rwoody/ht-core'

export default function createStory(req, res) {
  const {story} = req.body
  Story.create(story).then(data => {
    res.json(data)
  })
}
