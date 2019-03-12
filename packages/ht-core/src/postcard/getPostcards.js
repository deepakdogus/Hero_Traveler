import { Postcard } from '../models'

export default function getPostcards(limit = 100) {
  return Postcard.getPostcards(limit)
}
