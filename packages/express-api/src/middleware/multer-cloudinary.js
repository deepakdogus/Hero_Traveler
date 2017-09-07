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

const videoStorage = cloudinaryStorage({
  cloudinary: Cloudinary,
  filename(req, file, cb) {
    cb(undefined, makeFilename(file))
  },
  params: {
    resource_type: 'video',
    folder: process.env.ASSETS_VIDEOS_FOLDER
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
