import {Story} from '@rwoody/ht-core'

// Detailed story for reading, etc.
export default function getStory(req, res) {
  return Story.get(req.params.id)
}
