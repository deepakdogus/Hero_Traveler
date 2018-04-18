import {Models} from '../../ht-core'
import {algoliaHelper} from '@hero/ht-util'

export default function indexCategories(){
  Models.Category.find({isDefault: false})
  .then(algoliaHelper.addCategoriesToIndex)
}
