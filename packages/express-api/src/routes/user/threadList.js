import {Models} from '@hero/ht-core'

export default function threadsList(req) {
  return Models.Thread.list(req.user._id)
}