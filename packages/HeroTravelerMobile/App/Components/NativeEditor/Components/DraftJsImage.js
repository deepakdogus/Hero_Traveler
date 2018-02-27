import React, { Component }  from 'react'

import { Colors } from '../../../Shared/Themes'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import ImageWrapper from '../../ImageWrapper'
import Icon from 'react-native-vector-icons/FontAwesome'
import getImageUrl from "../../../Shared/Lib/getImageUrl"

export default class DraftJsImage extends Component {
  render = () => {
    const {height, width, url, isSelected, onPress, onDelete} = this.props

    const imageEditOverlay = (
      <View style={styles.assetEditOverlay}>
        <TouchableOpacity onPress={onDelete}>
          <Icon name='trash' color={Colors.snow} size={30} />
        </TouchableOpacity>
      </View>
    )
    let uri
    if (url.substring(0,4) === 'file' || url.substring(0,6) === '/Users') uri = url
    else uri = getImageUrl(url, 'optimized', {height, width})
    return (
      <TouchableWithoutFeedback
       style={this.props.style}
       onPress={onPress}>
       <ImageWrapper
         background={true}
         fullWidth={true}
         source={{ uri }}>
          {isSelected && imageEditOverlay}
        </ImageWrapper>
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

