import cloudinaryStorage from 'multer-storage-cloudinary'
import Cloudinary from 'cloudinary'
import {Models} from '../../ht-core'

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

function generateVideoStream(video) {
  let searchName = video.original.path.split('.')
  searchName.pop()
  searchName = searchName.join('.')
  Cloudinary.v2.uploader.explicit(searchName, {
    resource_type: 'video',
    type: 'upload',
    eager: [
      { streaming_profile: '4k', format: 'm3u8'},
      { streaming_profile: '4k', format: 'mpd'},
    ],
    eager_async: true,
    eager_notification_url: `${process.env.API_HOST}/story/draft/cover-video`
  },
    function(result) {
      console.log(result);
    }
  )
}

// patch used to create streaming urls for all the videos
export default function findVideoWithoutStream() {
  Models.Video.find({'streamingFormats': {"$exists": false}})
  .then(videos => {
    videos.forEach(video => {
      generateVideoStream(video)
    })
  })
}
