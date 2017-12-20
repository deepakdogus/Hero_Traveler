import {Models} from '../../ht-core'

const images = [{
  title: 'Wildlife',
  imageName: 'wildlife.jpg',
  dimensions: {
    width: 2000,
    height: 2000,
  }
}, {
  title: 'Expedition',
  imageName: 'expedition.jpg',
  dimensions: {
    width: 2000,
    height: 2000,
  }
}

]
// patch used to properly set the paths of the default categories
export default function createNewCategories() {
 return Promise.all(images.map(imgObject => {
    const {title, imageName, dimensions} = imgObject
    const createObj = {
      "title": title,
      "isDefault": true,
      "image": {
        "altText": title,
        "original": {
          "filename": imageName,
          "path": `category/${imageName}`,
          "width": dimensions.width,
          "height": dimensions.height,
          "meta": {
            "mimeType": "image/jpeg"
          }
        },
        "versions": {
          "thumbnail240": {
            "filename": imageName,
            "path": `category/thumbnail240/${imageName}`,
            "width": 240,
            "height": 240,
            "meta": {
              "mimeType": "image/jpeg"
            }
          }
        }
      }
    }
    return Models.Category.create(createObj)
  }))
}
