import { Postcard } from '@hero/ht-core'

// Detailed story for reading, etc.
export default function getStory(req, res) {
  return Postcard.get(req.params.id)
}
