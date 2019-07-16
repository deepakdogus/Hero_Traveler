import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import StarRating from 'react-native-star-rating'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import StoryEditActions from '../../Shared/Redux/StoryCreateRedux'
import {Metrics} from '../../Shared/Themes'
import ShadowButton from '../../Components/ShadowButton'
import Tooltip from '../../Components/Tooltip'
import NavBar from './NavBar'
import styles from './4_CreateStoryDetailScreenStyles'
import API from '../../Shared/Services/HeroAPI'
import FormInput from '../../Components/FormInput'
import TouchableMultilineInput from '../../Components/TouchableMultilineInput'
import RadioButton from '../../Components/RadioButton'

const api = API.create()

/***

 Helper functions

***/

class CreateSlideshowDetails extends React.Component {
  static propTypes = {
    workingDraft: PropTypes.object,
    story: PropTypes.object,
    updateWorkingDraft: PropTypes.func,
    saveDraft: PropTypes.func,
    accessToken: PropTypes.object,
    update: PropTypes.func,
    user: PropTypes.object,
    resetCreateStore: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      categories: props.workingDraft.categories || [],
      hashtags: props.workingDraft.hashtags || [],
      users: props.workingDraft.users || [],
      type: props.workingDraft.type,
      cost: props.workingDraft.cost || '',
      // We will not be updating the currency right now, but
      // it is used in constructing the placeholder text.
      currency: props.workingDraft.currency || '',
      starCount: 3,
      showError: false,
      error: null,
    }
  }

  componentWillMount() {
    api.setAuth(this.props.accessToken.value)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.storyCreateError){
      this.setState({
        showError: true,
        error: newProps.storyCreateError,
      })
      return
    }
  }

  onLocationChange = (location) => {
    this.props.updateWorkingDraft({location})
  }

  _onRight = () => {
    const {workingDraft} = this.props
    if (!workingDraft.title || !workingDraft.locationInfo || !workingDraft.type) {
      this.setState({
        validationError: 'Please add title, an activity type and location to continue',
      })
      return
    }
    if (workingDraft.draft) {
      workingDraft.draft = false
      this.props.saveDraft(workingDraft)
    }
    else this.saveDraft(workingDraft)
    this.next()
  }

  _onLeft = () => {
    NavActions.pop()
  }

  updateType = (type) => this.props.updateWorkingDraft({type})

  _updateTitle = (title) => {
    this.props.updateWorkingDraft({title})
  }

  _updateDescription = (description) => {
    this.props.updateWorkingDraft({description})
    NavActions.pop()
  }

  _closeError = () => {
    this.setState({showError: false})
  }

  _dismissTooltip = () => {
    this.setState({validationError:null})
  }

  saveDraft = (draft) => {
    this.props.update(
      draft.id,
      draft,
    )
  }

  next() {
    this.props.resetCreateStore()
    NavActions.tabbar({type: 'reset'})
    // NavActions.myFeed()
  }

  _receiveCategories = (selectedCategories) => {
    this.props.updateWorkingDraft({categories: selectedCategories})
    NavActions.pop()
  }

  _receiveHashtags = (selectedHashtags) => {
    this.props.updateWorkingDraft({hashtags: selectedHashtags})
    NavActions.pop()
  }

  _receiveUsers = (selectedUsers) => {
    this.props.updateWorkingDraft({users: selectedUsers})
    NavActions.pop()
  }

  _receiveTravelTips = (travelTips) => {
    this.props.updateWorkingDraft({travelTips: travelTips})
    NavActions.pop()
  }

  _updateButton = (button) => {
    this.props.updateWorkingDraft({button})
  }

  isDraft() {
    return this.props.story.draft || false
  }

  navToCategories = () => {
    NavActions.tagSelectorScreen({
      onDone: this._receiveCategories,
      tags: this.props.workingDraft.categories || this.state.categories,
      tagType: 'category',
    })
  }

  navToHashtags = () => {
    NavActions.tagSelectorScreen({
      onDone: this._receiveHashtags,
      tags: this.props.workingDraft.hashtags || this.state.hashtags,
      tagType: 'hashtag',
    })
  }

  navToTagUsers = () => {
    NavActions.tagSelectorScreen({
      onDone: this._receiveUsers,
      users: this.props.workingDraft.users || this.state.users,
      tagType: 'user',
    })
  }

  // if you change this... also make sure to change getLocationInfo's formatLocationInfo
  receiveLocation = (locationInfo) => {
    this.props.updateWorkingDraft({ locationInfo })
    NavActions.pop()
  }

  navToLocation = () => {
    NavActions.locationSelectorScreen({
      onSelectLocation: this.receiveLocation,
      // replace this with short name?
      location: this.props.workingDraft.locationInfo
        ? this.props.workingDraft.locationInfo.name
        : '',
    })
  }

  renderErrors() {
    if (this.state.showError) {
      const err = this.state.error
      let errText
      if ((__DEV__ && err && err.problem && err.status)) {
        errText = `${err.status}: ${err.problem}`
      }
      else if (err.text) {
        errText = err.text
      }
      return (
        <ShadowButton
          style={styles.errorButton}
          onPress={this._closeError}
          text={errText}
          title={err.message}
        />
      )
    }
  }

  getHashtagsValue() {
    const { hashtags } = this.props.workingDraft
    if (hashtags.length === 0) return undefined
    return _.map(hashtags, (hashtag) => {
      return `#${hashtag.title}`
    }).join(', ')
  }

  getCategoriesValue() {
    const { categories } = this.props.workingDraft
    if (categories.length === 0) return undefined
    return _.map(categories, 'title').join(', ')
  }

  getUsersValue() {
    const { users = [] } = this.props.workingDraft
    if (users.length === 0) return undefined
    return _.map(users, 'username').join(', ')
  }

  isValid() {
    const { workingDraft } = this.props
    return _.every([
      !!workingDraft,
      !!workingDraft.title,
      !!workingDraft.locationInfo,
      !!workingDraft.type,
    ])
  }

  onStarRatingPress = (rating) => {
    this.props.updateWorkingDraft({ rating })
  }

  navToAddButton = () => {
    const hasActionButton = this.hasActionButton()
    NavActions.createStory_addButton({
      updateWorkingDraft: this.props.updateWorkingDraft,
      currentLink: hasActionButton ? this.props.workingDraft.actionButton.link : '',
      buttonType: hasActionButton ? this.props.workingDraft.actionButton.type : '',
    })
  }

  hasActionButton = () => {
    const { workingDraft } = this.props
    return workingDraft && workingDraft.actionButton && workingDraft.actionButton.link
  }

  render () {
    const {workingDraft, user} = this.props
    const {validationError} = this.state
    return (
      <View style={styles.wrapper}>
        {this.renderErrors()}
        <NavBar
          title='SLIDESHOW DETAILS'
          leftIcon='arrowLeftRed'
          leftTitle='Back'
          onLeft={this._onLeft}
          leftTextStyle={styles.navBarLeftText}
          onRight={this._onRight}
          rightTitle={this.isDraft() ? 'Publish' : 'Save'}
          rightTextStyle={styles.redText}
          isRightValid={this.isValid()}
        />
        <ScrollView style={styles.root}>
          <Text style={styles.fieldLabel}>Title: </Text>
          <FormInput
            onChangeText={this._updateTitle}
            value={workingDraft.title}
            placeholder='Add a title'
          />
          <TouchableMultilineInput
            onDone={this._updateDescription}
            title='Description'
            label='Add a description'
            value={workingDraft.description}
            placeholder='Write a description'
          />
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Activity: </Text>
            <View style={styles.radioGroup}>
              <RadioButton
                selected={workingDraft.type === 'see'}
                value="see"
                onPress={this.updateType}
                text='SEE'
              />
              <RadioButton
                style={{marginLeft: Metrics.baseMargin}}
                selected={workingDraft.type === 'do'}
                value="do"
                onPress={this.updateType}
                text='DO'
              />
              <RadioButton
                selected={workingDraft.type === 'eat'}
                value="eat"
                onPress={this.updateType}
                text='EAT'
              />
              <RadioButton
                style={{marginLeft: Metrics.baseMargin}}
                selected={workingDraft.type === 'stay'}
                value="stay"
                onPress={this.updateType}
                text='STAY'
              />
            </View>
          </View>
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Rate this experience:</Text>
            <StarRating
              containerStyle={{
                marginTop: -5,
                marginLeft: 25,
                marginBottom: 10,
              }}
              disabled={false}
              emptyStar={'ios-star'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              starSize={25}
              rating={workingDraft.rating || 3}
              selectedStar={this.onStarRatingPress}
              fullStarColor={'red'}
            />
          </View>
          <FormInput
            onPress={this.navToLocation}
            iconName='location'
            value={workingDraft.locationInfo ? workingDraft.locationInfo.name : ''}
            placeholder='Location'
          />
          <FormInput
            onPress={this.navToCategories}
            iconName='tag'
            value={this.getCategoriesValue()}
            placeholder='Add categories...'
          />
          <FormInput
            onPress={this.navToHashtags}
            iconName='hashtag'
            value={this.getHashtagsValue()}
            placeholder='Add hashtags'
          />
          {/*<FormInput
            onPress={this.navToTagUsers}
            iconName='profile'
            value={this.getUsersValue()}
            placeholder='Tag users'
          />*/}
          {user && user.role !== 'user' && (
            <FormInput
              onPress={this.navToAddButton}
              iconName="addButton"
              value={this.hasActionButton() ? workingDraft.actionButton.link : ''}
              placeholder="Add an action button"
            />
          )}
        </ScrollView>
        {validationError
          && <Tooltip
            onPress={this._touchError}
            position={'right-nav-button'}
            text={validationError}
            onDismiss={this._dismissTooltip}
          />
        }
      </View>
    )
  }
}

export default connect(
  (state) => {
    return {
      accessToken: _.find(state.session.tokens, {type: 'access'}),
      story: {...state.storyCreate.workingDraft},
      workingDraft: {...state.storyCreate.workingDraft},
      storyCreateError: state.storyCreate.error,
      user: state.entities.users.entities[state.session.userId],
    }
  },
  dispatch => ({
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
    saveDraft: (story) => dispatch(StoryEditActions.saveLocalDraft(story)),
    update: (id, attrs) => dispatch(StoryEditActions.updateDraft(id, attrs, true)),
    resetCreateStore: () => dispatch(StoryEditActions.resetCreateStore()),
  }),
)(CreateSlideshowDetails)
