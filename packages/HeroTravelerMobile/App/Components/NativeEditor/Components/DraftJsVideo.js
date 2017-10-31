import React, { Component }  from 'react'

import { Colors } from '../../../Shared/Themes'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import Video from '../../Video'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getVideoUrlBase } from "../../../Shared/Lib/getVideoUrl"

export default class DraftJsVideo extends Component {
  render = () => {
    const {url, isSelected, onPress, onDelete, style} = this.props

    const videoUrl = `${getVideoUrlBase()}/${url}`

    const imageEditOverlay = (
      <View style={styles.assetEditOverlay}>
        <TouchableOpacity onPress={onDelete}>
          <Icon name='trash' color={Colors.snow} size={30} />
        </TouchableOpacity>
      </View>
    )
  
    return (
      <TouchableWithoutFeedback
       style={style}
       onPress={onPress}>
        <View style={styles.abs}>
          <Video
            path={videoUrl}
            allowVideoPlay={true}
            autoPlayVideo={false}
            showMuteButton={false}
            showPlayButton={true}
            playButtonSize={'small'}
            videoFillSpace={true}
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
