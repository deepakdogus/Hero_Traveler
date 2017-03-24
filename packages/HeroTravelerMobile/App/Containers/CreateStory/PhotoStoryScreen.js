import React from 'react'
import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Image } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import R from 'ramda'
import Icon from 'react-native-vector-icons/FontAwesome'

import SquaredButton from '../../Components/SquaredButton'
import RenderTextInput from '../../Components/RenderTextInput'
import Editor from '../../Components/Editor'
import styles, { placeholderColor } from './PhotoStoryScreenStyles'

class PhotoStoryScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isAddContentMenuOpen: false,
      newContentSection: null
    }
  }

  renderCoverPhoto = () => {
    const {story: {coverPhoto}} = this.props
    return R.ifElse(
      R.identity,
      R.always((
        <Image source={{uri: coverPhoto}}>
          <View style={styles.photoOverlay} />
          {this.renderContent()}
        </Image>
      )),
      R.always(this.renderContent(coverPhoto))
    )(!!coverPhoto)
  }

  renderTextColor = (baseStyle) => {
    return R.ifElse(
      R.identity,
      R.always([baseStyle, { color: 'white' }]),
      R.always(baseStyle),
    )(!!this.props.story.coverPhoto)
  }

  renderPlaceholderColor = (baseColor) => {
    return R.ifElse(
      R.identity,
      R.always('white'),
      R.always(baseColor)
    )(!!this.props.story.coverPhoto)
  }

  renderContent () {
    const {story} = this.props
    return (
      <KeyboardAvoidingView behavior='position'>
        <View style={styles.lightGreyAreasBG}>
          <View style={styles.spaceView} />
          <View style={styles.addPhotoView}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() => NavigationActions.photoSelectorScreen()}
            >
              <Icon name='camera' size={40} color='gray' style={styles.cameraIcon} />
              <Text style={this.renderTextColor(styles.baseTextColor)}>+ ADD COVER PHOTO</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addTitleView}>
            <Field
              name='title'
              component={RenderTextInput}
              style={this.renderTextColor(styles.titleInput)}
              placeholder='ADD A TITLE'
              placeholderTextColor={this.renderPlaceholderColor(placeholderColor)}
            />
            <Field
              name='description'
              component={RenderTextInput}
              style={this.renderTextColor(styles.subTitleInput)}
              value={story.description}
              placeholder='Add a subtitle'
              placeholderTextColor={this.renderPlaceholderColor(placeholderColor)}
            />
          </View>
        </View>
        <View style={styles.iconDownView}>
          <Icon name='caret-down' size={12} />
        </View>
      </KeyboardAvoidingView>
    )
  }

  render () {
    return (
      <View style={[styles.containerWithNavbar]}>
        <ScrollView>
          {this.renderCoverPhoto(this.props.story.coverPhoto)}
          <Editor />
        </ScrollView>
      </View>
    )
  }
}

const selector = formValueSelector('createStory')
export default R.compose(
  connect(state => ({
    story: {
      title: selector(state, 'title'),
      description: selector(state, 'description'),
      coverPhoto: selector(state, 'coverPhoto'),
    }
    // state: state
  })),
  reduxForm({
    form: 'createStory',
    destoryOnUnmount: false,
    initialValues: {
      title: '',
      description: '',
      coverPhoto: null
    }
  })
)(PhotoStoryScreen)
