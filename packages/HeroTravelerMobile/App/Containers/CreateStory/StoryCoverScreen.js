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

class StoryCoverScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      imageMenuOpen: false
    }
  }

  componentDidMount() {
    // Create a new draft to work with if one doesn't exist
    if (!this.props.story.id) {
      this.props.registerDraft()
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
        onPress: () => NavActions.pop()
      }, {
        text: 'No, remove it',
        onPress: () => {
          this.props.discardDraft(this.props.story.id)
          this.props.resetForm()
          NavActions.pop()
        }
      }]
    )
  }

  _onRight = () => {
    const {story} = this.props

    if (!story.coverPhoto && !story.title) {
      this.setState({error: 'Please add a cover and a title to continue'})
      return
    }

    this.props.update(this.props.story.id, story)
    NavActions.createStory_content()
  }

  renderContent () {
    const {story} = this.props

    return (
      <KeyboardAvoidingView behavior='position'>
        <View style={!story.coverPhoto ? styles.lightGreyAreasBG : null}>
          {!story.coverPhoto && <View style={styles.spaceView} />}
          {!story.coverPhoto &&
            <View style={[styles.spaceView, styles.addPhotoView]}>
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={() => {
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
          {story.coverPhoto && !this.state.imageMenuOpen &&
            <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
              <View>
                <View style={styles.spaceView} />
                <View style={styles.spaceView} />
              </View>
            </TouchableWithoutFeedback>
          }
          {story.coverPhoto && this.state.imageMenuOpen &&
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
          {this.renderCoverPhoto(this.props.story.coverPhoto)}
        </View>
      </View>
    )
  }

  _handleSelectCoverPhoto = (path) => {
    this.props.change('coverPhoto', path)
    NavActions.pop()
  }
}

const selector = formValueSelector('createStory')
export default R.compose(
  connect(state => ({
    story: {
      id: _.get(state.storyCreate.draft, 'id', null),
      title: selector(state, 'title'),
      description: selector(state, 'description'),
      coverPhoto: selector(state, 'coverPhoto'),
    }
    // state: state
  }), dispatch => ({
    registerDraft: () => dispatch(StoryEditActions.registerDraft()),
    discardDraft: (draftId) => dispatch(StoryEditActions.discardDraft(draftId)),
    resetForm: () => dispatch(resetForm('createStory')),
    update: (id, attrs) => {
      dispatch(
        StoryEditActions.updateDraft(id, attrs)
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
