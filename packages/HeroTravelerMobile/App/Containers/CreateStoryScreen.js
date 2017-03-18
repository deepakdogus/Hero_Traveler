import React from 'react'
import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Image } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import RenderTextInput from '../Components/RenderTextInput'
import R from 'ramda'

// Styles
import styles, { placeholderColor } from './Styles/CreateStoryScreenStyles'

class CreateStoryScreen extends React.Component {
  constructor (props) {
    super(props)
    this.renderCoverPhoto = this.renderCoverPhoto.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.renderPlaceholderColor = this.renderPlaceholderColor.bind(this)
    this.capitalizeText = this.capitalizeText.bind(this)
  }

  renderCoverPhoto (photoPath) {
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

  renderTextColor (baseStyle, photoPath) {
    return R.ifElse(
      R.identity,
      R.always([baseStyle, { color: 'white' }]),
      R.always(baseStyle),
    )(!!photoPath)
  }

  renderPlaceholderColor (baseColor, photoPath) {
    return R.ifElse(
      R.identity,
      R.always('white'),
      R.always(baseColor)
    )(!!photoPath)
  }

  capitalizeText (value) {
    return value.toUpperCase()
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
            <Text style={this.renderTextColor(styles.baseTextColor, photoPath)}>+ ADD COVER PHOTO</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addTitleView}>
          <Field
            name='title'
            component={RenderTextInput}
            style={this.renderTextColor(styles.titleInput, photoPath)}
            autoCapitalize='characters'
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

  renderStoryElements (elements) {
    console.log('elements are ', !!elements)
    return R.ifElse(
      R.identity,
      () => (
        <View>
          {
            elements.map(({ Component, ...props }, index) => {
              const map = {
                'RoundedButton': RoundedButton
              }
              const RenderComponent = map[Component]
              return <RenderComponent key={index} {...props} />
            })
          }
        </View>
      ),
      R.always(null)
    )(!!elements)
  }

  render () {
    console.log('foo is ', this.props.foo)
    console.log('title is ', this.props.title)
    return (
      <ScrollView style={[styles.containerWithNavbar, styles.containerWithNavbarOverride]}>
        {this.renderCoverPhoto(this.props.coverPhoto)}
        <View style={{flexDirection: 'row'}}>
          <RoundedButton
            style={{flex: 1}}
            text='photo'
          />
          <RoundedButton
            style={{flex: 1}}
            text='video'
          />
          <RoundedButton
            style={{flex: 1}}
            text='text'
          />
        </View>
        {this.renderStoryElements(this.props.storyElements)}
      </ScrollView>
    )
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
)(CreateStoryScreen)
