import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
  DatePickerIOS,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import StoryEditActions from '../../Shared/Redux/StoryCreateRedux'
import { Metrics } from '../../Shared/Themes'
import ShadowButton from '../../Components/ShadowButton'
import RoundedButton from '../../Components/RoundedButton'
import Tooltip from '../../Components/Tooltip'
import NavBar from './NavBar'
import styles from './4_CreateStoryDetailScreenStyles'
import API from '../../Shared/Services/HeroAPI'
import FormInput from '../../Components/FormInput'
import TouchableMultilineInput from '../../Components/TouchableMultilineInput'
import RadioButton from '../../Components/RadioButton'
// import StarRating from '../CreateStory/StarRating'

const api = API.create()

/***

 Helper functions

***/

const dateLikeItemAsDate = dateLikeItem => {
  const timeStamp = Date.parse(dateLikeItem)
  return isNaN(timeStamp) ? new Date() : new Date(timeStamp)
}

const dateLikeItemAsDateString = dateLikeItem => {
  const date = dateLikeItemAsDate(dateLikeItem)
  const dateString = date.toDateString()
  return dateString.replace(/\s/, ', ')
}

class CreateStoryDetailScreen extends React.Component {
  static propTypes = {
    workingDraft: PropTypes.object,
    story: PropTypes.object,
    user: PropTypes.object,
    updateWorkingDraft: PropTypes.func,
    saveDraft: PropTypes.func,
    accessToken: PropTypes.object,
    update: PropTypes.func,
    resetCreateStore: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      categories: props.workingDraft.categories || [],
      hashtags: props.workingDraft.hashtags || [],
      type: props.workingDraft.type,
      cost: props.workingDraft.cost || '',
      // We will not be updating the currency right now, but
      // it is used in constructing the placeholder text.
      currency: props.workingDraft.currency || '',
      showError: false,
      error: null,
    }
  }

  componentWillMount() {
    api.setAuth(this.props.accessToken.value)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.storyCreateError) {
      this.setState({
        showError: true,
        error: newProps.storyCreateError,
      })
      return
    }
  }

  _setModalVisible = (visible = true) => {
    this.setState({ modalVisible: visible })
  }

  onLocationChange = location => {
    this.props.updateWorkingDraft({ location })
  }

  _onDateChange = tripDate => {
    this.props.updateWorkingDraft({ tripDate })
  }

  confirmDate = () => {
    this._setModalVisible(!this.state.modalVisible)
    if (!this.props.workingDraft.tripDate) {
      this._onDateChange(new Date())
    }
  }

  _onRight = () => {
    const { workingDraft } = this.props
    if (!workingDraft.locationInfo || !workingDraft.type) {
      this.setState({
        validationError: 'Please add an activity type and location to continue',
      })
      return
    }
    // The numeric keyboard doesn't have a submit key and input may not
    // have been blurred prior to save. In that case we have to update
    // the working draft manually here.
    if (workingDraft.cost !== this.state.cost) {
      workingDraft.cost = this.state.cost
    }
    this.next()
    if (workingDraft.draft) {
      workingDraft.draft = false
      this.props.saveDraft(workingDraft)
    }
    else this.saveDraft(workingDraft)
  }

  _onLeft = () => {
    this._updateCost()
    NavActions.pop()
  }

  updateType = (type) => this.props.updateWorkingDraft({type})

  _updateRating = rating => {
    this.props.updateWorkingDraft({ rating })
  }

  _updateCostText = value => {
    this.setState({ cost: value })
  }

  _updateCost = () => {
    this.props.updateWorkingDraft({ cost: this.state.cost })
  }

  _getCostPlaceholderText = draft => {
    let placeholder
    switch (draft.type) {
    case 'see':
    case 'do':
      placeholder = 'Cost'
      break
    case 'eat':
      placeholder = 'Cost per person'
      break
    case 'stay':
      placeholder = 'Cost per night'
      break
    default:
      placeholder = 'Cost'
      break
    }
    // The currency is hardcoded for now, might want to change it later.
    let currency = draft.currency || 'USD'
    placeholder += ' (' + currency + ')'
    return placeholder
  }

  _closeError = () => {
    this.setState({ showError: false })
  }

  _dismissTooltip = () => {
    this.setState({ validationError: null })
  }

  saveDraft = draft => {
    this.props.update(draft.id, draft)
  }

  next() {
    this.props.resetCreateStore()
    NavActions.tabbar({ type: 'reset' })
    // NavActions.myFeed()
  }

  _receiveCategories = selectedCategories => {
    this.props.updateWorkingDraft({ categories: selectedCategories })
    NavActions.pop()
  }

  _receiveHashtags = selectedHashtags => {
    this.props.updateWorkingDraft({ hashtags: selectedHashtags })
    NavActions.pop()
  }

  _receiveTravelTips = travelTips => {
    this.props.updateWorkingDraft({ travelTips: travelTips })
    NavActions.pop()
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

  // if you change this... also make sure to change getLocationInfo's formatLocationInfo
  receiveLocation = locationInfo => {
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

  navToAddButton = () => {
    const hasActionButton = this.hasActionButton()
    NavActions.createStory_addButton({
      updateWorkingDraft: this.props.updateWorkingDraft,
      currentLink: hasActionButton ? this.props.workingDraft.actionButton.link : '',
      buttonType: hasActionButton ? this.props.workingDraft.actionButton.type : '',
    })
  }

  renderErrors() {
    if (this.state.showError) {
      const err = this.state.error
      let errText
      if (__DEV__ && err && err.problem && err.status) {
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
    return _.map(hashtags, hashtag => {
      return `#${hashtag.title}`
    }).join(', ')
  }

  getCategoriesValue() {
    const { categories } = this.props.workingDraft
    if (categories.length === 0) return undefined
    return _.map(categories, 'title').join(', ')
  }

  isValid() {
    const { workingDraft } = this.props
    return _.every([
      !!workingDraft,
      !!workingDraft.locationInfo,
      !!workingDraft.type,
    ])
  }

  hasActionButton = () => {
    const { workingDraft } = this.props
    return workingDraft && workingDraft.actionButton && workingDraft.actionButton.link
  }

  render() {
    const { workingDraft, user } = this.props
    const { modalVisible, validationError } = this.state

    return (
      <View style={styles.wrapper}>
        {this.renderErrors()}
        <NavBar
          title="STORY DETAILS"
          leftIcon="arrowLeftRed"
          leftTitle="Back"
          onLeft={this._onLeft}
          leftTextStyle={styles.navBarLeftText}
          onRight={this._onRight}
          rightTitle={this.isDraft() ? 'Publish' : 'Save'}
          rightTextStyle={styles.redText}
          isRightValid={this.isValid()}
        />
        <ScrollView style={styles.root}>
          <Text style={styles.title}>{this.props.story.title} Details </Text>
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
          {
          // disabled until further refined by Joe and Boon
          // <View style={[styles.fieldWrapper, styles.paddedFieldContainer]}>
          //   <Text style={[styles.fieldLabel, styles.fieldLabelStar]}>
          //     Rate this experience:{' '}
          //   </Text>
          //   <StarRating
          //     onChange={this._updateRating}
          //     valueSelected={workingDraft.rating}
          //   />
          // </View>
          }
          <FormInput
            onPress={this.navToLocation}
            iconName='location'
            value={workingDraft.locationInfo ? workingDraft.locationInfo.name : ''}
            placeholder='Location'
          />
          <FormInput
            onPress={this._setModalVisible}
            iconName='date'
            value={dateLikeItemAsDateString(workingDraft.tripDate)}
          />
          <FormInput
            onChangeText={this._updateCostText}
            iconName="cost"
            value={this.state.cost.toString()}
            placeholder={this._getCostPlaceholderText(workingDraft)}
            keyboardType="numeric"
            cost={this.state.cost}
          />
          <FormInput
            onPress={this.navToCategories}
            iconName="tag"
            value={this.getCategoriesValue()}
            placeholder="Add categories..."
          />
          <FormInput
            onPress={this.navToHashtags}
            iconName="hashtag"
            value={this.getHashtagsValue()}
            placeholder="Add hashtags"
          />
          {user && user.role !== 'user' && (
            <FormInput
              onPress={this.navToAddButton}
              iconName="addButton"
              value={this.hasActionButton() ? workingDraft.actionButton.link : ''}
              placeholder="Add an action button"
            />
          )}
          <TouchableMultilineInput
            onDone={this._receiveTravelTips}
            title="TRAVEL TIPS"
            label="Travel Tips: "
            value={workingDraft.travelTips}
            placeholder="What should your fellow travelers know?"
          />
        </ScrollView>
        {modalVisible && (
          <View
            style={styles.dateWrapper}
            shadowColor="black"
            shadowOpacity={0.9}
            shadowRadius={10}
            shadowOffset={{ width: 0, height: 0 }}
          >
            <View style={styles.dateView}>
              <DatePickerIOS
                date={dateLikeItemAsDate(workingDraft.tripDate)}
                mode="date"
                onDateChange={this._onDateChange}
              />
              <RoundedButton
                text="Confirm"
                onPress={this.confirmDate} />
            </View>
          </View>
        )}
        {validationError && (
          <Tooltip
            onPress={this._touchError}
            position={'right-nav-button'}
            text={validationError}
            onDismiss={this._dismissTooltip}
          />
        )}
      </View>
    )
  }
}

export default connect(
  state => {
    return {
      accessToken: _.find(state.session.tokens, { type: 'access' }),
      story: { ...state.storyCreate.workingDraft },
      workingDraft: { ...state.storyCreate.workingDraft },
      storyCreateError: state.storyCreate.error,
      user: state.entities.users.entities[state.session.userId],
    }
  },
  dispatch => ({
    updateWorkingDraft: update =>
      dispatch(StoryCreateActions.updateWorkingDraft(update)),
    saveDraft: story => dispatch(StoryEditActions.saveLocalDraft(story)),
    update: (id, attrs) =>
      dispatch(StoryEditActions.updateDraft(id, attrs, true)),
    resetCreateStore: () => dispatch(StoryEditActions.resetCreateStore()),
  }),
)(CreateStoryDetailScreen)
