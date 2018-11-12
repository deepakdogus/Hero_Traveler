// copied from ht-seed-data/src/data/categoryData then modified
// need to locally install the dependencies. Intentionally did not save them
// since they are only used for the patch

// import {Models} from '../../ht-core'
import {Models} from '@hero/ht-core'

import _ from 'lodash'
import string from 'string'
import fs from 'fs'
import path from 'path'
import sizeOf from 'image-size'
import sharp from 'sharp'

const distPath = path.resolve(__dirname, '../../ht-seed-data/dist/category_images')
const imagesPath = path.resolve(__dirname, '../../ht-seed-data/resources/categories-rectangle')
const categoryImages = fs.readdirSync(imagesPath)

const tileDimensions = {
  width: 494,
  height: 494,
}

const removeDefault = [
  'Asia',
  'Africa',
  'Australia',
  'Mexico',
  'Latin America',
  'North America',
  'South America',
  'Europe',
  'Caribbean',
  'South Pacific',
]

export default function() {
  return Promise.all(categoryImages.map(create))
}

function create(imageName) {
  const dashSpacedImageName = imageName.split(' ').join('-')
  const imagePath = path.resolve(imagesPath, imageName)
  const baseName = path.basename(imagePath)
  const title = string(baseName.replace(path.extname(baseName), ''))
    .titleCase()
    .s.split('-')
    .join(' ')

  const dimensions = sizeOf(imagePath)

  const category = {
    "title": title,
    "isDefault": true,
    "image": {
      "altText": title,
      "original": {
        "filename": imageName,
        "path": `category/${dashSpacedImageName}`,
        "width": dimensions.width,
        "height": dimensions.height,
        "meta": {
          "mimeType": "image/jpeg"
        }
      },
      "versions": {
        "thumbnail240": {
          "filename": 'cat-' + imageName,
          "path": `category/thumbnail240/cat-${dashSpacedImageName}`,
          "width": tileDimensions.width,
          "height": tileDimensions.height,
          "meta": {
            "mimeType": "image/jpeg"
          }
        }
      }
    }
  }

  return Models.Category.findOne({title}).exec()
  .then(dbCategory => {
    if (!dbCategory) {
      return Models.Category.create(category)
    }
    else {
      _.merge(dbCategory, category)
      return dbCategory.save()

    }
    return
  })
  .catch(err => console.log("error is", err))
  .then(() => {
    return Promise.all(removeDefault.map(title => {
      return Models.Category.findOne({title})
      .then(category => {
        category.isDefault = false
        return category.save()
      })
    }))
  })
}
