import { Postcard } from '@hero/ht-core'

export default function deletePostcard (req, res) {
  return Postcard.deletePostcard(req.params.id)
}
