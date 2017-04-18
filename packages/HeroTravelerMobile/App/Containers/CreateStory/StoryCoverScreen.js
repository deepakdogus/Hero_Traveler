import _ from 'lodash'
import React from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Image,
  Alert
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { reset as resetForm } from 'redux-form'
import { connect } from 'react-redux'
import R from 'ramda'
import Icon from 'react-native-vector-icons/FontAwesome'

import StoryEditActions from '../../Redux/StoryCreateRedux'
import ShadowButton from '../../Components/ShadowButton'
import RenderTextInput from '../../Components/RenderTextInput'
import {Colors, Images, Metrics} from '../../Themes'
import styles, { placeholderColor } from './StoryCoverScreenStyles'
import NavBar from './NavBar'

function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (_.includes(ext, 'jpg') || _.includes(ext, 'jpg')) {
    return 'image/jpeg'
  } else if (_.includes(ext, 'png')) {
    return 'image/png'
  } else if (_.includes(ext, 'gif')) {
    return 'image/gif'
  }
}

function getImage(story) {
  const path = _.get(story, 'coverImage.original.path')

  if (!path) return null

  return `https://s3.amazonaws.com/hero-traveler/${path}`
}

class StoryCoverScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      imageMenuOpen: false,
      file: null
    }
  }

  componentDidMount() {
    // Create a new draft to work with if one doesn't exist
    if (!this.props.story.id) {
      this.props.registerDraft()
    }
  }

  componentWillReceiveProps(nextProps) {
    // If we are cancelling the screen,
    // the draft resets,
    // redux-form clears,
    // and we pop()
    if (this.props.story && !nextProps.story) {
      NavActions.pop()
      this.props.resetForm()
    }
  }

  _toggleImageMenu = () => {
    this.setState({imageMenuOpen: !this.state.imageMenuOpen})
  }

  renderCoverPhoto(coverPhoto) {
    return R.ifElse(
      R.identity,
      R.always((
        <Image source={{uri: coverPhoto}} style={styles.coverPhoto}>
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

  _onLeft = () => {
    // When a user cancels the draft flow, remove the draft
    Alert.alert(
      'Cancel Draft',
      'Do you want to save this draft?',
      [{
        text: 'Yes, save the draft',
        onPress: () => {
          this.props.update(this.props.story.id, this.props.story, true)
        }
      }, {
        text: 'No, remove it',
        onPress: () => {
          this.props.discardDraft(this.props.story.id)
        }
      }]
    )
  }

  _onRight = () => {
    const {story} = this.props

    if ((!story.coverImage && !story.coverPhoto) || !story.title) {
      this.setState({error: 'Please add a cover and a title to continue'})
      return
    }

    this.props.update(this.props.story.id, story)
    if (this.state.file) {
      this.props.uploadCover(this.props.story.id, this.state.file)
      this.setState({file: null})
    }
    NavActions.createStory_content()
  }

  hasNoPhoto() {
    return !this.props.story.coverPhoto && !this.props.story.coverImage
  }

  renderContent () {
    const {story} = this.props
    return (
      <KeyboardAvoidingView behavior='position'>
        <View style={this.hasNoPhoto() ? styles.lightGreyAreasBG : null}>
          {this.hasNoPhoto() && <View style={styles.spaceView} />}
          {this.hasNoPhoto() &&
            <View style={[styles.spaceView, styles.addPhotoView]}>
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={() => {
                  this.setState({error: null})
                  NavActions.mediaSelectorScreen({
                    mediaType: 'photo',
                    title: 'Add a Cover',
                    leftTitle: 'Cancel',
                    onLeft: () => NavActions.pop(),
                    rightTitle: 'Next',
                    onSelectMedia: this._handleSelectCoverPhoto
                  })
                }}
              >
                <Icon name='camera' size={40} color='gray' style={styles.cameraIcon} />
                <Text style={this.renderTextColor(styles.baseTextColor)}>+ ADD COVER PHOTO</Text>
              </TouchableOpacity>
            </View>
          }
          {!this.hasNoPhoto() && !this.state.imageMenuOpen &&
            <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
              <View>
                <View style={styles.spaceView} />
                <View style={styles.spaceView} />
              </View>
            </TouchableWithoutFeedback>
          }
          {!this.hasNoPhoto() && this.state.imageMenuOpen &&
            <View>
              <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
                <View>
                  <View style={styles.spaceView} />
                  <View style={styles.imageMenuView}>
                    <TouchableOpacity
                      onPress={() =>
                        NavActions.mediaSelectorScreen({
                          mediaType: 'photo',
                          title: 'Change Cover',
                          leftTitle: 'Cancel',
                          onLeft: () => NavActions.pop(),
                          rightTitle: 'Update',
                          onSelectMedia: this._handleSelectCoverPhoto
                        })
                      }
                      style={styles.iconButton}>
                      <Icon name='camera' color={Colors.snow} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => alert('crop')}
                      style={styles.iconButton}>
                      <Icon name='crop' color={Colors.snow} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => alert('Remove Cover Image')}
                      style={styles.iconButton}>
                      <Icon name='trash' color={Colors.snow} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this._toggleImageMenu}
                      style={styles.iconButton}>
                      <Icon name='close' color={Colors.snow} size={30} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          }
          <View style={styles.addTitleView}>
            <Field
              name='title'
              component={RenderTextInput}
              editable={!this.state.imageMenuOpen}
              style={this.renderTextColor(styles.titleInput)}
              placeholder='ADD A TITLE'
              placeholderTextColor={this.renderPlaceholderColor(placeholderColor)}
            />
            <Field
              name='description'
              component={RenderTextInput}
              editable={!this.state.imageMenuOpen}
              style={this.renderTextColor(styles.subTitleInput)}
              value={story.description}
              placeholder='Add a subtitle'
              placeholderTextColor={this.renderPlaceholderColor(placeholderColor)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <NavBar
          title='Story Cover'
          leftTitle='Cancel'
          onLeft={this._onLeft}
          rightTitle='Next'
          onRight={this._onRight}
        />
        <View style={{flex: 1}}>
          {this.state.error &&
            <ShadowButton
              style={styles.errorButton}
              onPress={() => this.setState({error: null})}
              text={this.state.error} />
          }
          {this.renderCoverPhoto(this.props.story.coverPhoto || getImage(this.props.story))}
        </View>
      </View>
    )
  }

  _handleSelectCoverPhoto = (path) => {
    const file = {
      uri: path,
      name: path.split('/').pop(),
      type: getMimeType(path)
    }
    this.setState({file: file})
    this.props.change('coverPhoto', path)
    NavActions.pop()
  }
}

const selector = formValueSelector('createStory')
export default R.compose(
  connect(state => ({
    story: {
      title: selector(state, 'title'),
      description: selector(state, 'description'),
      coverPhoto: selector(state, 'coverPhoto'),
      ...state.storyCreate.draft
    }
    // state: state
  }), dispatch => ({
    registerDraft: () => dispatch(StoryEditActions.registerDraft()),
    discardDraft: (draftId) => dispatch(StoryEditActions.discardDraft(draftId)),
    resetForm: () => dispatch(resetForm('createStory')),
    update: (id, attrs, doReset) => {
      dispatch(
        StoryEditActions.updateDraft(id, attrs, doReset)
      )
    },
    uploadCover: (id, path) => {
      dispatch(
        StoryEditActions.uploadCoverImage(id, path)
      )
    }
  })),
  reduxForm({
    form: 'createStory',
    destroyOnUnmount: false,
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    initialValues: {
      title: '',
      description: '',
      coverPhoto: null,
    }
  })
)(StoryCoverScreen)
