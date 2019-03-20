import { Postcard } from '../models'

export default function deletePostcard (cardId) {
  return Postcard.delete({_id: cardId})
}
