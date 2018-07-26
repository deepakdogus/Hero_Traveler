import Promise from 'bluebird'
import {Comment, Models} from '@hero/ht-core'
import {guideCommentNotification} from '../../apn'

export default function createGuideComment(req) {
  const commentator = req.user
  const userId = commentator._id
  const {guideId} = req.params
  const {content} = req.body
  return Comment.create({
    guide: guideId,
    user: userId,
    content
  })
  .then(({updatedModel, comment}) => {
    // Dont send notifications to yourself
    const isNotGuideAuthor = !userId.equals(updatedModel.author)
    if (isNotGuideAuthor) {
      Models.User.findOne({_id: updatedModel.author}).then((author) => {
        // Notifications are not critical for the outcome
        // so they should not block the resolution of the promise.
        guideCommentNotification(author, commentator, updatedModel);
      })
    }
    Promise.resolve(comment);
  });
}
