import faker from 'faker'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import sizeOf from 'image-size'
import sharp from 'sharp'

import {Models} from '@hero/ht-core'

const distPath = path.resolve(__dirname, '../../dist/story_images')
const imagesPath = path.resolve(__dirname, '../../resources/story_images')
const storyImages = fs.readdirSync(imagesPath)

function create(users, categories) {
  const imageName = storyImages[_.random(0, storyImages.length - 1)]
  const user = users[_.random(0, users.length - 1)]
  const category = categories[_.random(0, categories.length - 1)]
  const imagePath = path.resolve(imagesPath, imageName)
  const baseName = path.basename(imagePath)
  const title = _.capitalize(faker.random.words())
  const description = _.capitalize(faker.random.words())
  const dimensions = sizeOf(imagePath)

  return Promise.all([
    sharp(imagePath)
      .resize(750, 1334)
      .toFile(path.resolve(distPath, imageName))
  ])
  .then(([file]) => {
    return Models.Image.create({
      purpose: 'storyImage',
      altText: title,
      original: {
        filename: imageName,
        path: `seed/originals/${imageName}`,
        bucket: process.env.AWS_S3_BUCKET,
        width: dimensions.width,
        height: dimensions.height,
        meta: {
          size: file.size,
          mimeType: file.mimetype
        }
      },
      versions: {
        mobile: {
          filename: imageName,
          path: `story/750x1334/${imageName}`,
          bucket: process.env.AWS_S3_BUCKET,
          width: 750,
          height: 1334,
          meta: {
            mimeType: file.mimetype
          }
        }
      }
    })
  })
  .then(imageModel => {
    return {
      "author": user._id,
      "title": title,
      "description": description,
      "category": category._id,
      "createdAt": faker.date.past(),
      "counts": {
        "likes": _.random(1, 50000),
        "bookmarks": _.random(1, 50000),
        "comments": _.random(1, 50000)
      },
      "coverImage": imageModel._id,
    }
  })
}

export default function(users, categories, count) {
  return Promise.all(_.map(_.range(count), () => create(users, categories)))
}
