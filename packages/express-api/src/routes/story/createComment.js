import Promise from 'bluebird'
import {Comment, Models} from '@hero/ht-core'
import {commentNotification} from '../../apn'

export default function createComment(req) {
  const commentator = req.user
  const userId = commentator._id
  const storyId = req.params.id
  const {content} = req.body
  return Comment.create({
    story: storyId,
    user: userId,
    content
  })
  .then(({story, comment}) => {
    // Dont send notifications to yourself
    const isNotStoryAuthor = !userId.equals(story.author)
    if (isNotStoryAuthor) {
      Models.User.findOne({_id: story.author}).then((author) => {
        // Notifications are not critical for the outcome
        // so they should not block the resolution of the promise.
        commentNotification(author, commentator, story);
      })
    }
    Promise.resolve(comment);
  });
}
