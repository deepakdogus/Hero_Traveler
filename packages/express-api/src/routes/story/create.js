import {Story} from '@rwoody/ht-core'

export default function createStory(req, res) {
  const {story} = req.body
  const author = req.user._id
  Story.create(Object.assign(
    {},
    story,
    {author}
  )).then(data => {
    res.json(data)
  })
}
