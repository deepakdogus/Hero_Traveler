import PropTypes from 'prop-types'
import React, { Component } from 'react'
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
import Icon from 'react-native-vector-icons/FontAwesome'
import getImageUrl from '../Shared/Lib/getImageUrl'
import getVideoUrl from '../Shared/Lib/getVideoUrl'
import ImageWrapper from './ImageWrapper'
import VideoPlayer, {TouchlessPlayButton} from './VideoPlayer'
import TabIcon from './TabIcon'

import styles from './Styles/EditableCoverMediaStyles'

class EditableCoverMedia extends Component {
  static propTypes = {
    isPhoto: PropTypes.bool,
    media: PropTypes.object,
    mediaType: PropTypes.string,
    clearError: PropTypes.func,
    targetId: PropTypes.string,
    onUpdate: PropTypes.func,
    onTrimError: PropTypes.func,
    jumpToTop: PropTypes.func,
  }

  state = {
    imageMenuOpen: false,
    toolbarOpacity: new Animated.Value(1),
  }

  hasNoPhoto() {
    return !this.props.media.coverImage
  }

  hasNoVideo() {
    return !this.props.media.coverVideo
  }

  hasNoCover() {
    return this.hasNoPhoto() && this.hasNoVideo()
  }

  _contentAddCover = () => {
    this.props.clearError({error: null})
    NavActions.mediaSelectorScreen({
      mediaType: this.props.mediaType,
      title: 'ADD COVER',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Next',
      onSelectMedia: this._handleSelectCover
    })
  }

  _touchChangeCover = () => {
    this.setState({imageMenuOpen: false}, () => {
      this.resetAnimation()
    })
    NavActions.mediaSelectorScreen({
      mediaType: this.props.mediaType,
      title: 'Change Cover',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Update',
      onSelectMedia: this._handleSelectCover
    })
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
          meta: coverMetrics
        }
      }

      if (isPhotoType) {
        update.coverImage = modifiedFile
        update.coverVideo = undefined
      } else {
        update.coverImage = undefined
        update.coverVideo = modifiedFile
      }

      this.setState({
        file,
        isScrollDown: true,
        coverMetrics,
      })
      this.props.onUpdate(update)
      NavActions.pop()
    }

    trimVideo(file.uri, callback, this.props.targetId, this)
  }

  resetAnimation() {
    this.state.toolbarOpacity.stopAnimation(() => {
      this.state.toolbarOpacity.setValue(1)
    })
  }

  fadeOutMenu() {
    Animated.timing(
      this.state.toolbarOpacity,
      {
        toValue: 0,
        duration: 300
      }
    ).start(() => {
      this.setState({imageMenuOpen: false}, () => {
        this.resetAnimation()
      })
    })
  }

  _toggleImageMenu = () => {
    if (this.state.imageMenuOpen) {

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.setState({imageMenuOpen: false}, () => {
        this.resetAnimation()
      })
    } else {
      this.setState({imageMenuOpen: true})
      this.timeout = setTimeout(() => {
        if (this.state.imageMenuOpen) {
          this.fadeOutMenu()
        }
      }, 5000)
    }
  }

  renderContent () {
    const {imageMenuOpen, toolbarOpacity} = this.state
    const {media} = this.props
    return (
      <View style={!media ? styles.lightGreyAreasBG : styles.contentWrapper}>
        {!media &&
          <View style={[styles.addPhotoView]}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={this._contentAddCover}
            >
              <TabIcon name='cameraDark' style={{
                view: styles.cameraIcon,
                image: styles.cameraIconImage,
              }} />
              <Text style={[styles.baseTextColor, styles.coverPhotoText]}>
                + ADD COVER PHOTO OR VIDEO
              </Text>
            </TouchableOpacity>
          </View>
        }
        {!!media && !imageMenuOpen &&
          <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
            <View style={styles.imageMenuView}>
              {!this.hasNoVideo() &&
                <TouchlessPlayButton />
              }
            </View>
          </TouchableWithoutFeedback>
        }
        {!!media && imageMenuOpen &&
          <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
            <Animated.View style={[
              styles.imageMenuView,
              {opacity: toolbarOpacity}
            ]}>
              <TouchableOpacity
                onPress={this._touchChangeCover}
                style={styles.iconButton}
              >
                <Icon name={'camera'} color={Colors.snow} size={30} />
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        }
      </View>
    )
  }

  render = () => {
    const {isPhoto, media} = this.props

    if (media && isPhoto) {
      return (
        <ImageWrapper
          background={true}
          source={{uri: getImageUrl(media, 'basic')}}
          style={styles.coverPhoto}
          resizeMode='cover'
        >
          <View style={styles.contentWrapper}>
            {this.renderContent()}
          </View>
        </ImageWrapper>
      )
    }
    else if (media && !isPhoto) {
      return (
        <View style={styles.coverVideo}>
          <VideoPlayer
            path={getVideoUrl(media)}
            allowVideoPlay={false}
            autoPlayVideo={false}
            showPlayButton={false}
            resizeMode='cover'
            showControls={false}
          />
          {this.renderContent()}
        </View>
      )
    }
    return this.renderContent()
  }
}

export default EditableCoverMedia
