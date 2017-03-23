import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { Colors } from '../Shared/Themes'
import {
  Animated,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import pathAsFileObject from '../Shared/Lib/pathAsFileObject'
import { trimVideo } from '../Shared/Lib/mediaHelpers'
import { Actions as NavActions } from 'react-native-router-flux'
import R from 'ramda'
import Icon from 'react-native-vector-icons/FontAwesome'
import getImageUrl from '../Shared/Lib/getImageUrl'
import getVideoUrl from '../Shared/Lib/getVideoUrl'
import ImageWrapper from './ImageWrapper'
import VideoPlayer from './VideoPlayer'
import TabIcon from './TabIcon'

import styles from './Styles/CoverMediaStyles'

class CoverMedia extends Component {
  static defaultProps = {
    media: null,
  }
  static propTypes = {
    media: PropTypes.string,
    isPhoto: PropTypes.bool.isRequired,
  }
  state = {
    imageMenuOpen: false,
    toolbarOpacity: new Animated.Value(1),
  }

  hasNoCover = () => !this.props.media

  handleSelectCover = (path, isPhotoType, coverMetrics = {}) => {
    const { onError, onUpdate } = this.props

    const file = pathAsFileObject(path)
    const updates = { coverCaption: '' }

    const callback = newSource => {
      const modifiedFile = { ...file, uri: newSource }

      if (isPhotoType) {
        updates.coverImage = modifiedFile
        updates.coverVideo = undefined
      } else {
        updates.coverImage = undefined
        updates.coverVideo = modifiedFile
      }

      this.setState({
        file,
        isScrollDown: true,
      })
      if (onUpdate) onUpdate(updates)
      NavActions.pop()
    }
    const handleError = () => {
      NavActions.pop()
      if (onError) onError()
    }
    // QUESTION: Why does this invoke trimVideo even if we know it's a photo?
    trimVideo(file.uri, callback, handleError)
  }

  resetAnimation = () => {
    this.state.toolbarOpacity.stopAnimation(() => {
      this.state.toolbarOpacity.setValue(1)
    })
  }

  contentAddCover = () => {
    this.setState({ error: null })
    NavActions.mediaSelectorScreen({
      title: 'Add Cover',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Next',
      onSelectMedia: this.handleSelectCover,
    })
  }
  fadeOutMenu() {
    Animated.timing(this.state.toolbarOpacity, {
      toValue: 0,
      duration: 300,
    }).start(() => {
      this.setState({ imageMenuOpen: false }, () => {
        this.resetAnimation()
      })
    })
  }
  toggleImageMenu = () => {
    if (this.state.imageMenuOpen) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.setState({ imageMenuOpen: false }, () => {
        this.resetAnimation()
      })
    } else {
      this.setState({ imageMenuOpen: true })
      this.timeout = setTimeout(() => {
        if (this.state.imageMenuOpen) {
          this.fadeOutMenu()
        }
      }, 5000)
    }
  }
  touchChangeCover = () => {
    this.setState({ imageMenuOpen: false }, () => {
      this.resetAnimation()
    })
    NavActions.mediaSelectorScreen({
      title: 'Change Cover',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Update',
      onSelectMedia: this.handleSelectCover,
    })
  }
  renderContent = () => {
    const {
      contentAddCover,
      hasNoCover,
      state,
      toggleImageMenu,
      touchChangeCover,
    } = this
    const { imageMenuOpen, toolbarOpacity } = state
    return (
      <View
        style={hasNoCover() ? styles.lightGreyAreasBG : styles.contentWrapper}>
        {hasNoCover() && (
          <View style={[styles.addPhotoView]}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={contentAddCover}>
              <TabIcon
                name="cameraDark"
                style={{
                  view: styles.cameraIcon,
                  image: styles.cameraIconImage,
                }}
              />
              {/* In what scenario does this text become snow colored?*/}
              <Text style={[styles.baseTextColor, styles.coverPhotoText]}>
                + ADD COVER PHOTO OR VIDEO
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!hasNoCover() &&
          !imageMenuOpen && (
            <TouchableWithoutFeedback onPress={toggleImageMenu}>
              <View style={styles.coverHeight} />
            </TouchableWithoutFeedback>
          )}
        {!hasNoCover() &&
          imageMenuOpen && (
            <TouchableWithoutFeedback onPress={toggleImageMenu}>
              <Animated.View
                style={[styles.imageMenuView, { opacity: toolbarOpacity }]}>
                <TouchableOpacity
                  onPress={touchChangeCover}
                  style={styles.iconButton}>
                  <Icon name={'camera'} color={Colors.snow} size={30} />
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          )}
      </View>
    )
  }

  render = () => {
    let { media, isPhoto } = this.props
    let mediaUrl
    if (media && isPhoto) mediaUrl = getImageUrl(media, 'basic')
    if (media && isPhoto) {
      return (
        <ImageWrapper
          background={true}
          source={{ uri: mediaUrl }}
          style={styles.coverPhoto}
          resizeMode="cover">
          {this.renderContent()}
        </ImageWrapper>
      )
    } else if (media && !isPhoto) {
      return (
        <View style={styles.coverVideo}>
          <VideoPlayer
            path={media}
            allowVideoPlay={false}
            autoPlayVideo={false}
            showPlayButton={false}
            resizeMode="cover"
          />
          {this.renderContent()}
        </View>
      )
    } else {
      return this.renderContent()
    }
  }
}

export default CoverMedia
