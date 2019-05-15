import {Category} from '../models'
import {getCountCategoryGuides} from '../guide'

export default function listCategoriesWithCounts(params) {
  return Category.getMany(params)
    .then((data) => {
      const countGuides = data.data.map(guide => getCountCategoryGuides(guide.id).then((count) => ({
        ...guide.toObject(),
        numberOfGuides: count
      })))
      return Promise.all(countGuides).then((results) => {
        return {
          data: results,
          count: data.count
        }
      })
    })
}
