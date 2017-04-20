import {Models} from '@rwoody/ht-core'

export default function threadsList(req) {
  return Models.ThreadMessage.list(req.params.id, req.user._id)
}