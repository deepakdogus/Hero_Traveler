import {
  Story,
  Comment,
  ActivityStoryComment,
  Guide,
} from '../models'

export default function createComment(attrs) {
  return Comment.create(attrs)
    .then(comment => {
      const targetModel = attrs.story ? Story : Guide
      return targetModel.findOneAndUpdate(
          {_id: attrs.story || attrs.guide},
          {$inc: {'counts.comments': 1}},
          {new: true}
        )
        .then(updatedModel => {
          return updatedModel
          // return ActivityStoryComment.add(
          //   updatedModel.author,
          //   attrs.user,
          //   comment._id,
          //   updatedModel._id
          // ).then(() => Promise.resolve(updatedModel))
        })
        .then(updatedModel => {
          return Promise.resolve({updatedModel, comment})
        })
    })
}
