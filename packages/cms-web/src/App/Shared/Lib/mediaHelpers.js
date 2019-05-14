import {
  NativeModules,
} from 'react-native'
import { ProcessingManager } from 'react-native-video-processing'
const VideoManager = NativeModules.VideoManager

const MediaTypes = {
  video: 'video',
  photo: 'photo',
}

const getMediaType = coverVideo =>
  coverVideo ? MediaTypes.video : MediaTypes.photo

const isPhotoType = coverVideo => getMediaType(coverVideo) === MediaTypes.photo

async function trimVideo(videoFile, callback, storyId, _this){
  console.log('videoFile', videoFile)
  try {
    let newSource = videoFile
    const { duration } = await ProcessingManager.getVideoInfo(newSource)
    if (duration > 60) {
      newSource = await ProcessingManager.trim(newSource, { startTime: 0, endTime: 60 })
    }
    newSource = await VideoManager.moveVideo(newSource, storyId)
    callback(newSource)
  } catch(e) {
      console.log(`Issue trimming video ${e}`)
      _this.props.onTrimError()
      // _this.setState({error: 'There\'s an issue with the video you selected. Please try another.'})
      NavActions.pop()
      // jump to top to reveal error message
      _this.props.jumpToTop()
  }
}
export { isPhotoType, trimVideo }
