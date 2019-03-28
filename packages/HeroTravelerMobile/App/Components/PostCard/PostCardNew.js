import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../../Shared/Themes'
import pathAsFileObject from '../../Shared/Lib/pathAsFileObject'
import { trimVideo } from '../../Shared/Lib/mediaHelpers'
import styles from '../Styles/PostCardStyles'

export default class PostCardNew extends Component {
  static propTypes = {
    postcard: PropTypes.object,
    onPressNew: PropTypes.func,
  }

  _handleSelectCover = (path, isPhotoType, coverMetrics = {}) => {
    const file = pathAsFileObject(path)
    const update = { coverCaption: '' }

    const callback = (newSource) => {
      // nesting coverMetrics inside of original.meta to mirror published media asset format
      const modifiedFile = {
        ...file,
        uri: newSource,
        original: {
          meta: coverMetrics,
        },
      }

      if (isPhotoType) {
        update.coverImage = modifiedFile
        update.coverVideo = undefined
      }
      else {
        update.coverImage = undefined
        update.coverVideo = modifiedFile
      }

      this.setState({
        file,
        isScrollDown: true,
        coverMetrics,
      })
      NavActions.createQuickShare({
        media: update,
        mediaType: isPhotoType ? 'photo' : 'video',
      })
    }

    trimVideo(file.uri, callback, 'postcard', this)
  }

  onPressPostCard = () => {
    NavActions.mediaSelectorScreen({
      title: 'CREATE QUICKSHARE',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Next',
      onSelectMedia: this._handleSelectCover,
    })
  }

  render() {
    return (
      <View style={styles.newPostContainer}>
        <TouchableOpacity
          onPress={this.onPressPostCard}
          style={styles.newPostInnerContainer}
        >
          <Icon name='ios-add' size={42} color={Colors.red} />
          <Text style={styles.newPostCaption}>
            Add Postcard
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
