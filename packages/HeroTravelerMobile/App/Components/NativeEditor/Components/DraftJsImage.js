import React, { Component }  from 'react'

import { Colors } from '../../../Shared/Themes'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import Image from '../../Image'
import Icon from 'react-native-vector-icons/FontAwesome'
import getImageUrl from "../../../Shared/Lib/getImageUrl"

export default class DraftJsImage extends Component {
  render = () => {
    const url = this.props.url
    const isSelected = this.props.isSelected
    const onPress = this.props.onPress
    const onDelete = this.props.onDelete

    const imageEditOverlay = (
      <View style={styles.assetEditOverlay}>
        <TouchableOpacity onPress={onDelete}>
          <Icon name='trash' color={Colors.snow} size={30} />
        </TouchableOpacity>
      </View>
    )

    return (
      <TouchableWithoutFeedback
       style={this.props.style}
       onPress={onPress}>
        <Image
         fullWidth={true}
         source={{ uri: getImageUrl(url, 'basic') }}>
          {isSelected && imageEditOverlay}
        </Image>
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

