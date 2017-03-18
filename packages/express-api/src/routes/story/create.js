import {Models} from '@rwoody/ht-core'

export default function createStory(req, res) {
  const {title} = req.body
  Models.Story.create({
    title,
  }).then(data => {
    res.json(data)
  })
}
