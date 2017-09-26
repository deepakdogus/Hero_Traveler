import {Models} from '../../ht-core'
import algoliasearchModule from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const categoryIndex = client.initIndex(process.env.ALGOLIA_CATEGORY_INDEX)

export default function indexCategories(){
  Models.Category.find({isDefault: false})
  .then(categories => {
    const formattedCategories = categories.map(category => {
      return {
        _id: category._id,
        title: category.title,
      }
    })
    return new Promise((resolve, reject) => {
      categoryIndex.addObjects(formattedCategories, (error, content)=> {
        if (error) reject(error)
        else resolve(content)
      })
    })
  })
}
