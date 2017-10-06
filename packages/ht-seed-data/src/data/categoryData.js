import _ from 'lodash'
import string from 'string'
import fs from 'fs'
import path from 'path'
import sizeOf from 'image-size'
import sharp from 'sharp'

const distPath = path.resolve(__dirname, '../../dist/category_images')
const imagesPath = path.resolve(__dirname, '../../resources/categories')
const categoryImages = fs.readdirSync(imagesPath)

function create(imageName) {
  const dashSpacedImageName = imageName.split(' ').join('-')
  const imagePath = path.resolve(imagesPath, imageName)
  const baseName = path.basename(imagePath)
  const title = string(baseName.replace(path.extname(baseName), '')).titleCase().s
  const dimensions = sizeOf(imagePath)
  return Promise.all([
    sharp(imagePath)
      .resize(240, 240)
      .toFile(path.resolve(distPath, imageName))
  ])
  .then(([file]) => {
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
            "filename": imageName,
            "path": `category/thumbnail240/${dashSpacedImageName}`,
            "width": 240,
            "height": 240,
            "meta": {
              "mimeType": "image/jpeg"
            }
          }
        }
      }
    }
  })
}

export default function() {
  return Promise.all(_.map(categoryImages, create))
}
