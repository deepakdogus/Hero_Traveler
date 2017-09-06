import {Story} from '@hero/ht-core'

export default function createStory(req, res) {
  const {story: storyAttrs} = req.body
  return Story.create(storyAttrs)
}
