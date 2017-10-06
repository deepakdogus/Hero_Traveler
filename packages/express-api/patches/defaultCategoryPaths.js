import {Models} from '../../ht-core'

function splitAndJoin(originalString ,splitString = ' ', joinString = '-') {
  return originalString.split(splitString).join(joinString)
}

// patch used to properly set the paths of the default categories
export default function setFlag() {
  Models.Category.find({isDefault: true})
  .then(categories => {
    return categories.map(category => {
      category.image.versions.thumbnail240.path = splitAndJoin(category.image.versions.thumbnail240.path)
      category.image.original.path = splitAndJoin(category.image.original.path)
      return category.save()
    })
  })
}
