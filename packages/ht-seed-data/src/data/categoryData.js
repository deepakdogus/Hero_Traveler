import _ from 'lodash'
import string from 'string'
import fs from 'fs'
import path from 'path'
import sizeOf from 'image-size'
import sharp from 'sharp'

const distPath = path.resolve(__dirname, '../../dist/category_images')
const imagesPath = path.resolve(__dirname, '../../resources/categories-rectangle')
const categoryImages = fs.readdirSync(imagesPath)

function create(imageName) {
  const dashSpacedImageName = imageName.split(' ').join('-')
  const imagePath = path.resolve(imagesPath, imageName)
  const baseName = path.basename(imagePath)
  const title = string(baseName.replace(path.extname(baseName), '')).titleCase().s.split('-').join(' ')
  const dimensions = sizeOf(imagePath)
  return {
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
          "width": 494,
          "height": 494,
          "meta": {
            "mimeType": "image/jpeg"
          }
        }
      }
    }
  }
}

export default function() {
  return Promise.all(_.map(categoryImages, create))
}
