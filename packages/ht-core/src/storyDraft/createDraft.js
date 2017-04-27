import {StoryDraft, Category} from '../models'

export default function createDraft(attrs) {

  // @TODO temp. add a category to the model
  return Category.findOne({})
    .then(cat => {
      console.log('cat', cat)
      return StoryDraft.create({
        ...attrs,
        category: cat._id
      })
    })
}
