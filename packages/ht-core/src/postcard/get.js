import {Postcard} from '../models'

export default function getOnePostcard(cardId) {
  return Postcard.get({
    _id: cardId
  })
}
