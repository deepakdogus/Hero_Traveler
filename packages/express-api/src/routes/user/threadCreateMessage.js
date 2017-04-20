import _ from 'lodash'
import {Models} from '@rwoody/ht-core'

export default function createMessage(req) {
  const {content} = req.body
  return Models.ThreadMessage.create(Object.assign(
    {},
    {
      thread: req.params.id,
      user: req.user._id
    },
    {content}
  ))
    .then(message => {
      return Models.Thread.findOne({
        _id: message.thread
      })
      .then(thread => {
        const users = _.map(thread.users, u => {
          // The posting user has already seen the message
          return {
            _id: u._id,
            user: u.user,
            hasSeenLastMessage: u.user.equals(req.user._id)
          }
        })
        thread.users = users
        thread.markModified('users')
        return thread.save()
      })
      .then(() => {
        return message
      })
    })
}