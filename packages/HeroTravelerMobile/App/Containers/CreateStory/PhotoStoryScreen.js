import React from 'react'
import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Image } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import R from 'ramda'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'

import SquaredButton from '../../Components/SquaredButton'
import RenderTextInput from '../../Components/RenderTextInput'
import styles, { placeholderColor } from './PhotoStoryScreenStyles'

class PhotoStoryScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isAddContentMenuOpen: false,
      newContentSection: null
    }
  }

  renderCoverPhoto = (photoPath) => {
    console.log('photoPath', photoPath)
    return R.ifElse(
      R.identity,
      R.always((
        <Image source={{uri: photoPath}}>
          <View style={styles.photoOverlay} />
          {this.renderContent(photoPath)}
        </Image>
      )),
      R.always(this.renderContent(photoPath))
    )(!!photoPath)
  }

  renderTextColor = (baseStyle, photoPath) => {
    return R.ifElse(
      R.identity,
      R.always([baseStyle, { color: 'white' }]),
      R.always(baseStyle),
    )(!!photoPath)
  }

  renderPlaceholderColor = (baseColor, photoPath) => {
    return R.ifElse(
      R.identity,
      R.always('white'),
      R.always(baseColor)
    )(!!photoPath)
  }

  renderContent (photoPath) {
    return (
      <KeyboardAvoidingView behavior='position'>
        <View style={styles.spaceView} />
        <View style={styles.addPhotoView}>
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={() => NavigationActions.photoSelectorScreen()}
          >
            <Icon name='camera' size={40} color='gray' />
            <Text style={this.renderTextColor(styles.baseTextColor, photoPath)}>+ ADD COVER PHOTO</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addTitleView}>
          <Field
            name='title'
            component={RenderTextInput}
            style={this.renderTextColor(styles.titleInput, photoPath)}
            placeholder='ADD A TITLE'
            placeholderTextColor={this.renderPlaceholderColor(placeholderColor, photoPath)}
          />
          <Field
            name='subTitle'
            component={RenderTextInput}
            style={this.renderTextColor(styles.subTitleInput, photoPath)}
            placeholder='Add a subtitle'
            placeholderTextColor={this.renderPlaceholderColor(placeholderColor, photoPath)}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }

  render () {
    return (
      <ScrollView style={[styles.containerWithNavbarAndTabbar]}>
        {this.renderCoverPhoto(this.props.coverPhoto)}
        <View
          style={styles.addContentWrapper}
        >
          <SquaredButton
            style={styles.createMenuButton}
            onPress={this._addText}
          >
            <Icon name="font" size={15} />
          </SquaredButton>
          <SquaredButton
            style={styles.createMenuButton}
            onPress={this._addLink}
          >
            <Icon name="link" size={15} />
          </SquaredButton>
          <SquaredButton
            style={styles.createMenuButton}
            onPress={this._addPhoto}
          >
            <Icon name="camera" size={15} />
          </SquaredButton>
          <SquaredButton
            style={styles.createMenuButton}
            onPress={this._addVideo}
          >
            <Icon name="video-camera" size={15} />
          </SquaredButton>
        </View>
      </ScrollView>
    )
  }

  _toggleCreateButton = () => {
    this.setState({
      isAddContentMenuOpen: !this.state.isAddContentMenuOpen
    })
  }

  _addPhoto = () => {
    this.setState({
      newContentSection: 'photo'
    })
  }

  _addVideo = () => {
    this.setState({
      newContentSection: 'video'
    })
  }

  _addText = () => {
    this.setState({
      newContentSection: 'text'
    })
  }
}

const selector = formValueSelector('createStory')
export default R.compose(
  connect(state => ({
    coverPhoto: selector(state, 'coverPhoto'),
    storyElements: selector(state, 'storyElements'),
    foo: selector(state, 'foo'),
    title: selector(state, 'title'),
    state: state
  })),
  reduxForm({
    form: 'createStory',
    destoryOnUnmount: false,
    initialValues: {
      title: '',
      subTitle: '',
      coverPhoto: null,
      storyElements: [{
        Component: 'RoundedButton',
        text: 'work!'
      }]
    }
  })
)(PhotoStoryScreen)
