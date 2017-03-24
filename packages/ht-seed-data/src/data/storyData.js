import faker from 'faker'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import sizeOf from 'image-size'
import sharp from 'sharp'

const distPath = path.resolve(__dirname, '../../dist/stories')
const imagesPath = path.resolve(__dirname, '../../resources/story_images')
const storyImages = fs.readdirSync(imagesPath)

function create(users, categories) {
  const imageName = storyImages[_.random(0, storyImages.length - 1)]
  const user = users[_.random(0, users.length - 1)]
  const category = categories[_.random(0, categories.length - 1)]
  const imagePath = path.resolve(imagesPath, imageName)
  const baseName = path.basename(imagePath)
  const title = _.capitalize(faker.random.words())
  const dimensions = sizeOf(imagePath)

  return Promise.all([
    sharp(imagePath)
      .resize(750, 1334)
      .toFile(path.resolve(distPath, imageName))
  ])
  .then(([file]) => {
    return {
      "title": title,
      "description": _.capitalize(faker.random.words()),
      "author": user._id,
      "category": category._id,
      "counts": {
        "likes": _.random(1, 999)
      },
      "coverImage": {
        "altText": title,
        "original": {
          "filename": imageName,
          "path": "category/",
          "width": dimensions.width,
          "height": dimensions.height,
          "meta": {
            "mimeType": "image/jpeg"
          }
        },
        "versions": {
          "mobile": {
            "filename": imageName,
            "path": "story/750x1334/",
            "width": 750,
            "height": 1334,
            "meta": {
              "mimeType": "image/jpeg"
            }
          }
        }
      }
    }
  })
}

export default function(users, categories, count) {
  return Promise.all(_.map(_.range(count), () => create(users, categories)))
}
