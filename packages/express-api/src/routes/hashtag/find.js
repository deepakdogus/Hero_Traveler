import {Hashtag} from '@hero/ht-core'

export default function findHashtags(req, res) {
  return Hashtag.find({
    $or: [
      {isDefault: true},
      {isPromoted: true}
    ]
  })
}
