import {Hashtag} from '../models'

export default function findHashtags(query) {
  return Hashtag.find(query)
}
