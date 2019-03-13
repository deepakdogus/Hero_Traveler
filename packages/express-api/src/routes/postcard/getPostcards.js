import { Postcard } from '@hero/ht-core'

export default function getPostcards(req, res) {
  const limit = parseInt(req.query.limit, 10)
  return Postcard.getPostcards(limit)
}
