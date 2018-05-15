import { ProcessingManager } from 'react-native-video-processing'

const MediaTypes = {
  video: 'video',
  photo: 'photo',
}

const getMediaType = coverVideo =>
  coverVideo ? MediaTypes.video : MediaTypes.photo

const isPhotoType = coverVideo => getMediaType(coverVideo) === MediaTypes.photo

async function trimVideo(videoFile, callback, onError) {
  try {
    let newSource = videoFile
    const { duration } = await ProcessingManager.getVideoInfo(videoFile)
    if (duration > 60) {
      newSource = await ProcessingManager.trim(videoFile, {
        startTime: 0,
        endTime: 60,
      })
    }
    callback(newSource)
  } catch (e) {
    if (onError) onError()
  }
}

export { isPhotoType, trimVideo }
