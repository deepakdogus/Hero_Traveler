import {Models} from '@hero/ht-core'

export default function threadsList(req) {
  return Models.ThreadMessage.list(req.params.id, req.user._id)
}