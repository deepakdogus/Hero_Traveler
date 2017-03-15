import {Models} from 'ht-core'

export default function getAllStories(req, res) {
  Models.Story.find({}).then(data => {
    res.json(data)
  })
}

