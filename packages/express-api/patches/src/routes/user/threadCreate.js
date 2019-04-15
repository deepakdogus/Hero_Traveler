import _ from 'lodash'
import {Models} from '@hero/ht-core'

export default function createThread(req) {
  // user is the person receiving the message
  const {user, content} = req.body
  return Models.Thread.start(req.user._id, user, content)
}