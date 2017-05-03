import {Story, Comment, ActivityStoryComment} from '../models'

export default function createComment(attrs) {
  return Comment.create(attrs)
    .then(comment => {
      return Story.findOneAndUpdate(
          {_id: attrs.story},
          {$inc: {'counts.comments': 1}},
          {new: true}
        )
        .then(story => {
          return ActivityStoryComment.add(
            story.author,
            attrs.user,
            comment._id,
            story._id
          ).then(() => Promise.resolve(story))
        })
        .then(story => {
          return Promise.resolve({story, comment})
        })
    })
}
