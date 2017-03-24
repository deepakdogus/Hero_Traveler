import {Story} from '@rwoody/ht-core'

export default function getAllStories(req, res) {
  return Story.find().then(data => {
    res.json(data)
  })
}
