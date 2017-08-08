import Promise from 'bluebird'
import {Comment, Models} from '@hero/ht-core'
import {commentNotification} from '../../apn'

export default function createComment(req) {
  const userId = req.user._id
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
    return Promise.all([
      Models.UserDevice.find({user: story.author}),
      Models.User.findOne({_id: story.author})
    ])
    .spread((devices, user) => {
      if (isNotStoryAuthor && user.receivesCommentNotifications() && !!devices) {
        return commentNotification(devices, story, req.user)
      } else {
        return Promise.resolve()
      }
    })
    .then(() => Promise.resolve(comment))
  })
}
