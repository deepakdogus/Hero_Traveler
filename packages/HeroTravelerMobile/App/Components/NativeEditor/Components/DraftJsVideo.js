import React, { Component }  from 'react'

import { Colors, Metrics } from '../../../Shared/Themes'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import VideoPlayer from '../../VideoPlayer'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getVideoUrlBase } from "../../../Shared/Lib/getVideoUrl"
import getRelativeHeight from "../../../Shared/Lib/getRelativeHeight"

export default class DraftJsVideo extends Component {
  render = () => {
    const {url, isSelected, onPress, onDelete, style, sizeMetrics = undefined} = this.props

    let videoUrl
    if (url.substring(0,7) === 'file://') videoUrl = url
    else videoUrl = `${getVideoUrlBase()}/${url}`
    const imageEditOverlay = (
      <View style={styles.assetEditOverlay}>
        <TouchableOpacity onPress={onDelete}>
          <Icon name='trash' color={Colors.snow} size={30} />
        </TouchableOpacity>
      </View>
    )
    const height = (sizeMetrics) && getRelativeHeight(Metrics.screenWidth, sizeMetrics)

    return (
      <TouchableWithoutFeedback
       style={style}
       onPress={onPress}>
        <View style={[styles.abs, {height}]}>
          <VideoPlayer
            path={videoUrl}
            allowVideoPlay={true}
            autoPlayVideo={false}
            showMuteButton={false}
            showPlayButton={true}
            playButtonSize={'small'}
            videoFillSpace={true}
            resizeMode='cover'
          />
          {isSelected && imageEditOverlay}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const absStretch = {
  position: 'absolute',
  top: 0,
  right:0,
  bottom: 0,
  left: 0,
}

const styles = StyleSheet.create({
  assetEditOverlay: {
    backgroundColor: 'rgba(0,0,0,.6)',
    ...absStretch,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})
