import {Story} from '@rwoody/ht-core'

export default function createStory(req, res) {
  const {story: storyAttrs} = req.body
  const author = req.user._id

  return Story.create(Object.assign(
    {},
    storyAttrs,
    {author}
  ))
}
