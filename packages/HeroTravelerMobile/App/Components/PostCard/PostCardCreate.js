import React, { Component } from 'react'
import { View, ImageBackground, TextInput } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import { Colors } from '../../Shared/Themes'
import FormInput from '../FormInput'
import NavBar from '../../Containers/CreateStory/NavBar'

import styles from '../Styles/PostCardStyles'

export default class PostCardCreate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      location: '',
      title: '',
      titleHeight: 37,
    }
  }

  setTitleHeight = (event) => {
    this.setState({titleHeight: event.nativeEvent.contentSize.height})
  }

  setTitle = (title) => {
    this.setState({
      title,
    })
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

  _handleSelectCover = () => {
    NavActions.createQuickShare({

    })
  }

  navToMedia = () => {
    // NavActions.mediaSelectorScreen({
    //   title: 'CREATE QUICKSHARE',
    //   leftTitle: 'Cancel',
    //   onLeft: () => NavActions.pop(),
    //   rightTitle: 'Next',
    //   onSelectMedia: this._handleSelectCover,
    // })
  }

  render() {
    const { title, location } = this.state
    return (
      <ImageBackground style={styles.container}>
        {/* <NavBar
          title='CREATE QUICKSHARE'
          onLeft={this.navToMedia}
          leftTitle='Back'
          onRight={NavActions.pop()}
          rightIcon={'arrowRightRed'}
          rightTitle='Cancel'
          rightTextStyle={styles.navBarRightTextStyle}
          style={styles.navBarStyle}
        /> */}
        <View style={styles.container}>
          <FormInput
            onPress={this.navToLocation}
            iconName='location'
            value={location ? location.name : ''}
            placeholder='Location'
          />
          <TextInput
            style={[
              styles.titleInput,
              {height: this.state.titleHeight},
            ]}
            placeholder='Add a title'
            placeholderTextColor={Colors.background}
            value={title}
            onChangeText={this.setTitleAndFocus}
            returnKeyType='done'
            maxLength={40}
            multiline={true}
            blurOnSubmit
            onContentSizeChange={this.setTitleHeight}
          />
          
        </View>
      </ImageBackground>
    )
  }
}
