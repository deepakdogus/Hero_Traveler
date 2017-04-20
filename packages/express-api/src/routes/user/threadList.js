import {Models} from '@rwoody/ht-core'

export default function threadsList(req) {
  return Models.Thread.list(req.user._id)
}