import path from 'path'
import AWS from 'aws-sdk'
import multer from 'multer'
import cloudinaryStorage from 'multer-storage-cloudinary'
import Cloudinary from 'cloudinary'
import uuid from 'uuid'

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

function makeFilename(file) {
  const nameWithoutExt = path.basename(file.originalname, path.extname(file.originalname))
  console.log('filename', nameWithoutExt)
  return `${uuid()}-${nameWithoutExt}`
}

/*
to debug streaming locally you need to `ngrok http 3000` and
change .env's API_HOST to the address they give you

doing an eager transformation to get the video in suitable streaming formats
m3u8 is used for HLS (Apple devices, Safari, and the latest Chrome and Android browsers)
mpd is used for DASH (Chrome/Android 4.0+, IE11 for Windoes 8.1, SmartTVs)
see https://cloudinary.com/documentation/video_manipulation_and_delivery#step_3_deliver_the_video
*/
const videoStorage = cloudinaryStorage({
  cloudinary: Cloudinary,
  filename(req, file, cb) {
    cb(undefined, makeFilename(file))
  },
  params: {
    resource_type: 'video',
    folder: process.env.ASSETS_VIDEOS_FOLDER,
    eager: [
      { streaming_profile: '4k', format: 'm3u8'},
      { streaming_profile: '4k', format: 'mpd'},
    ],
    eager_async: true,
    eager_notification_url: `${process.env.API_HOST}/story/draft/cover-video`
  }
})

const imageStorage = cloudinaryStorage({
  cloudinary: Cloudinary,
  folder: process.env.ASSETS_IMAGES_FOLDER,
  filename(req, file, cb) {
    cb(undefined, makeFilename(file))
  }
})

const avatarStorage = cloudinaryStorage({
  cloudinary: Cloudinary,
  folder: process.env.ASSETS_AVATARS_FOLDER,
  filename(req, file, cb) {
    cb(undefined, makeFilename(file))
  }
})

const coverStorage = cloudinaryStorage({
  cloudinary: Cloudinary,
  folder: process.env.ASSETS_COVERS_FOLDER,
  filename(req, file, cb) {
    cb(undefined, makeFilename(file))
  }
})

export const multerVideo = multer({
  storage: videoStorage
})

export const multerImage = multer({
  storage: imageStorage
})

export const multerAvatar = multer({
  storage: avatarStorage
})

export const multerCover = multer({
  storage: coverStorage
})
