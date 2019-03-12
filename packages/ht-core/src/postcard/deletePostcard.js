import { Postcard } from '../models'

export default function deletePostcard (cardId) {
  // intentionally doing algolia delete first to prevent client side search crash
  return Postcard.delete({_id: cardId})
}
