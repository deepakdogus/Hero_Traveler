import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ImageBackground, TextInput } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import { Colors } from '../../Shared/Themes'
import FormInput from '../FormInput'
import NavBar from '../../Containers/CreateStory/NavBar'
import RoundedButton from '../RoundedButton'

import styles from '../Styles/PostCardStyles'

export default class PostCardCreate extends Component {
  static props = {
    media: PropTypes.object,
    mediaType: PropTypes.string,
    fetchStatus: PropTypes.object,
    createPostcard: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      location: '',
      title: '',
      titleHeight: 37,
    }
  }

  setTitle = (title) => {
    this.setState({
      title,
    })
  }

  setTitleHeight = (event) => {
    this.setState({titleHeight: event.nativeEvent.contentSize.height})
  }

  setTitleAndFocus = (title) => {
    this.setTitle(title)
  }

  receiveLocation = (location) => {
    this.setState({
      location,
    })
    NavActions.pop()
  }

  navToLocation = () => {
    const { location } = this.state
    NavActions.locationSelectorScreen({
      onSelectLocation: this.receiveLocation,
      // replace this with short name?
      location: location
        ? location.name
        : '',
    })
  }

  checkValidation = () => {
    const { title, location } = this.state
    if (title && location) {
      return true
    }
    return false
  }

  onCancelClick = () => {
    NavActions.pop()
    setTimeout(() => {
      NavActions.pop()
    })
  }

  onPublishClick = () => {
    const { createPostcard, media, mediaType, fetchStatus } = this.props
    const { title, location } = this.state
    const postcard = {
      title,
      locationInfo: location,
      ...media,
    }
    createPostcard(postcard)
    NavActions.tabbar({type: 'reset'})
  }

  render() {
    const { media, mediaType, fetchStatus } = this.props
    const { title, location } = this.state
    return (
      <ImageBackground
        source={{uri: media.coverImage.uri}}
        style={styles.imageContainer}
      >
        <View style={styles.imageOverlayContainer}>
          <NavBar
            title='CREATE QUICKSHARE'
            titleStyle={styles.navBarTitleStyle}
            onLeft={NavActions.pop}
            leftIcon='arrowLeftRed'
            leftTextStyle={styles.navBarLeftTextStyle}
            leftIconStyle={styles.navBarLeftTextStyle}
            onRight={this.onCancelClick}
            rightTitle='Cancel'
            rightTextStyle={styles.navBarRightTextStyle}
            style={styles.navBarStyle}
          />
          <View style={styles.formContainer}>
            <FormInput
              onPress={this.navToLocation}
              iconName='location'
              value={location ? location.name : ''}
              placeholder='Add a location'
              placeholderColor={Colors.white}
              style={styles.locationInputStyle}
            />
            <TextInput
              style={[
                styles.titleInput,
                {height: this.state.titleHeight},
              ]}
              placeholder='Add a title'
              placeholderTextColor={Colors.white}
              value={title}
              onChangeText={this.setTitleAndFocus}
              returnKeyType='done'
              maxLength={40}
              multiline={true}
              blurOnSubmit
              onContentSizeChange={this.setTitleHeight}
            />
          </View>
          <RoundedButton
            style={styles.publishBtnStyle}
            textStyle={(!this.checkValidation() || fetchStatus.fetching) ? styles.disabledBtnTextStyle : styles.publishBtnTextStyle}
            text='PUBLISH'
            onPress={(!this.checkValidation() || fetchStatus.fetching) ? () => {} : this.onPublishClick}
          />
        </View>
      </ImageBackground>
    )
  }
}
