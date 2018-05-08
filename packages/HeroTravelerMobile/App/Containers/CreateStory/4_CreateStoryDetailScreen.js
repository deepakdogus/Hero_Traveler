import _ from 'lodash'
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  DatePickerIOS,
  TextInput,
} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import StoryEditActions from '../../Shared/Redux/StoryCreateRedux'
import {Colors, Metrics} from '../../Shared/Themes'
import Loader from '../../Components/Loader'
import ShadowButton from '../../Components/ShadowButton'
import TabIcon from '../../Components/TabIcon'
import RoundedButton from '../../Components/RoundedButton'
import Tooltip from '../../Components/Tooltip'
import NavBar from './NavBar'
import styles from './4_CreateStoryDetailScreenStyles'
import API from '../../Shared/Services/HeroAPI'
const api = API.create()

/***

 Helper functions

***/

const dateLikeItemAsDate = (dateLikeItem) => {
  const timeStamp = Date.parse(dateLikeItem)
  return isNaN(timeStamp) ? new Date() : new Date(timeStamp)
}

const dateLikeItemAsDateString = (dateLikeItem) => {
  const date = dateLikeItemAsDate(dateLikeItem)
  const dateString = date.toDateString()
  return dateString.replace(/\s/, ', ')
}


const Radio = ({text, onPress, name, selected}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.radio}>
        <View style={[styles.radioBtnOuter, selected ? styles.radioBtnActiveBorder : {}]}>
          <View style={[styles.radioBtnInner, selected ? styles.radioBtnActiveBackground : {}]}/>
        </View>
        <Text style={styles.radioText}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

/* note that the icon style objects below are separate because they must be a must
be a plain objects instead of stylesheets */

const commonIconStyle = {
  marginRight: Metrics.doubleBaseMargin,
  marginBottom: Metrics.baseMargin,
}

let iconSizes = {
  location: { width: 17, height: 27, },
  date: { width: 22, height: 22, },
  category: { width: 22, height: 22, },
  hashtag: { width: 22, height: 24, marginTop: -2},
  cost: { width: 22, height: 24, marginTop: -3},
}

let iconStyles = {};

for (let s in iconSizes) {
  iconStyles[s] = {
    // This is to ensure the input fields align correctly
    view: { width: Metrics.icons.large },
    image: Object.assign({}, commonIconStyle, iconSizes[s])
  }
}

class CreateStoryDetailScreen extends React.Component {

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
    if (newProps.storyCreateError){
      this.setState({
        showError: true,
        error: newProps.storyCreateError,
      })
      return
    }
  }

  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible })
  }

  onLocationChange = (location) => {
    this.props.updateWorkingDraft({location})
  }

  _onDateChange = (tripDate) => {
    this.props.updateWorkingDraft({tripDate})
  }

  confirmDate = () => {
    this._setModalVisible(!this.state.modalVisible)
    if (!this.props.workingDraft.tripDate) {
      this._onDateChange(new Date())
    }
  }

  _onRight = () => {
    const {workingDraft} = this.props
    if (!workingDraft.locationInfo || !workingDraft.type) {
      this.setState({
        validationError: "Please add an activity type and location to continue"
      })
      return;
    }
    // The numeric keyboard doesn't have a submit key and input may not
    // have been blurred prior to save. In that case we have to update
    // the working draft manually here.
    if (workingDraft.cost !== this.state.cost) {
      workingDraft.cost = this.state.cost;
    }
    this.next();
    if (workingDraft.draft) this.props.publish(workingDraft)
    else this.saveDraft(workingDraft)
  }

  _onLeft = () => {
    this._updateCost();
    NavActions.pop()
  }

  _updateType = (type) => {
    this.props.updateWorkingDraft({type})
  }

  _updateCostText = (value) => {
    this.setState({cost:value})
  }

  _updateCost = () => {
    this.props.updateWorkingDraft({cost:this.state.cost})
  }

  _getCostPlaceholderText = (draft) => {
    let placeholder;
    switch (draft.type) {
      case 'see':
      case 'do':
        placeholder = 'Cost'
        break;
      case 'eat':
        placeholder = 'Cost per person'
        break;
      case 'stay':
        placeholder = 'Cost per night'
        break;
      default:
        placeholder = 'Cost'
        break;
    }
    // The currency is hardcoded for now, might want to change it later.
    let currency = draft.currency || 'USD';
    placeholder += ' (' + currency + ')'
    return placeholder;
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
    NavActions.myFeed()
  }

  _receiveCategories = (selectedCategories) => {
    this.props.updateWorkingDraft({categories: selectedCategories})
    NavActions.pop()
  }

  _receiveHashtags = (selectedHashtags) => {
    this.props.updateWorkingDraft({hashtags: selectedHashtags})
    NavActions.pop()
  }

  _receiveTravelTips = (travelTips) => {
    this.props.updateWorkingDraft({travelTips: travelTips})
    NavActions.pop()
  }

  isDraft() {
    return this.props.story.draft || false
  }

  navToCategories = () => {
    NavActions.createStory_tags({
      onDone: this._receiveCategories,
      tags: this.props.workingDraft.categories || this.state.categories,
      tagType: 'category'
    })
  }

  navToHashtags = () => {
    NavActions.createStory_hashtags({
      onDone: this._receiveHashtags,
      tags: this.props.workingDraft.hashtags || this.state.hashtags,
      tagType: 'hashtag'
    })
  }

  navToTravelTips = () => {
    NavActions.createStory_travelTips({
      onDone: this._receiveTravelTips,
      text: this.props.workingDraft.travelTips,
      title: 'TRAVEL TIPS',
      placeholder: 'What should your fellow travelers know?'
    })
  }

  // if you change this... also make sure to change getLocationInfo's formatLocationInfo
  receiveLocation = (place) => {
    this.props.updateWorkingDraft({
      locationInfo: {
        name: place.name,
        locality: _.get(place, 'addressComponents.sublocality_level_1') || _.get(place, 'addressComponents.locality'),
        state: _.get(place, 'addressComponents.administrative_area_level_1'),
        country: _.get(place, 'addressComponents.country'),
        latitude: place.latitude,
        longitude: place.longitude,
      }
    })
    NavActions.pop()
  }

  navToLocation = () => {
    NavActions.createStory_location({
      navBack: NavActions.pop,
      onSelectLocation: this.receiveLocation,
      // replace this with short name?
      location: this.props.workingDraft.locationInfo ? this.props.workingDraft.locationInfo.name : '',
    })
  }

  renderErrors() {
    if (this.state.showError) {
      const err = this.state.error;
      let errText;
      if ((__DEV__ && err && err.problem && err.status)) {
        errText = `${err.status}: ${err.problem}`;
      } else if (err.text) {
        errText = err.text;
      }
      return (
        <ShadowButton
          style={styles.errorButton}
          onPress={this._closeError}
          text={errText}
          title={err.message}
        />
      );
    }
  }

  render () {
    const {workingDraft} = this.props
    const {modalVisible, validationError} = this.state

    return (
      <View style={styles.wrapper}>
          {this.renderErrors()}
          <NavBar
            title='Story Details'
            leftIcon='arrowLeftRed'
            leftTitle='Back'
            onLeft={this._onLeft}
            leftTextStyle={{paddingLeft: 10}}
            onRight={this._onRight}
            rightTitle={this.isDraft() ? 'Publish' : 'Save'}
            rightTextStyle={{color: Colors.red}}
          />
          <ScrollView style={styles.root}>
            <Text style={styles.title}>{this.props.story.title} Details </Text>
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Activity: </Text>
              <View style={styles.radioGroup}>
                <Radio
                  selected={workingDraft.type === 'see'}
                  onPress={() => this._updateType('see')}
                  text='SEE'
                />
                <Radio
                  style={{marginLeft: Metrics.baseMargin}}
                  selected={workingDraft.type === 'do'}
                  onPress={() => this._updateType('do')}
                  text='DO'
                />
                <Radio
                  selected={workingDraft.type === 'eat'}
                  onPress={() => this._updateType('eat')}
                  text='EAT'
                />
                <Radio
                  style={{marginLeft: Metrics.baseMargin}}
                  selected={workingDraft.type === 'stay'}
                  onPress={() => this._updateType('stay')}
                  text='STAY'
                />
              </View>
            </View>
            <View style={styles.fieldWrapper}>
              <TabIcon name='location' style={iconStyles.location} />
              <TouchableWithoutFeedback onPress={this.navToLocation}>
                <View>
                  <Text
                    style={[
                      styles.inputStyle,
                      workingDraft.locationInfo ? null : {color: Colors.navBarText}
                    ]}
                    placeholder='Location'
                    placeholderTextColor={Colors.navBarText}
                    value={workingDraft.locationInfo ? workingDraft.locationInfo.name : ''}
                  >
                    {
                      workingDraft.locationInfo ?
                      workingDraft.locationInfo.name :
                      'Location'
                    }
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.fieldWrapper} >
              <TabIcon name='date' style={iconStyles.date} />
              <TouchableHighlight
                onPress={() => this._setModalVisible(true)}
              >
                <Text style={styles.inputStyle}>
                  {dateLikeItemAsDateString(workingDraft.tripDate)}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={styles.fieldWrapper}>
              <TabIcon name='cost' style={iconStyles.cost} />
              <View style={styles.longInput}>
                {!!(this.state.cost) &&
                  <Text style={[styles.currency]}>$</Text>
                }
                <TextInput
                  style={[styles.longInputText]}
                  value={this.state.cost.toString()}
                  onChangeText={this._updateCostText}
                  onBlur={this._updateCost}
                  onSubmitEditing={this._updateCost}
                  placeholder={this._getCostPlaceholderText(workingDraft)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.fieldWrapper}>
              <TabIcon name='tag' style={iconStyles.category} />
              <TouchableWithoutFeedback
                onPress={this.navToCategories}
                style={styles.tagStyle}
              >
                <View>
                  {_.size(workingDraft.categories) > 0 && <Text style={styles.tagStyleText}>{_.map(workingDraft.categories, 'title').join(', ')}</Text>}
                  {_.size(workingDraft.categories) === 0 && <Text style={[styles.tagStyleText, {color: '#bdbdbd'}]}>Add categories...</Text>}
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.fieldWrapper}>
              <TabIcon name='hashtag' style={iconStyles.hashtag} />
              <TouchableWithoutFeedback
                onPress={this.navToHashtags}
                style={styles.tagStyle}
              >
                <View>
                  {_.size(workingDraft.hashtags) > 0 &&
                    <Text style={styles.tagStyleText}>{
                      _.map(workingDraft.hashtags,
                        (hashtag) => { return '#' + hashtag.title }).join(', ')
                    }</Text>
                  }
                  {_.size(workingDraft.hashtags) === 0 &&
                    <Text style={styles.tagStyleText}>Add hashtags...</Text>
                  }
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.travelTipsWrapper}>
              <Text style={styles.fieldLabel}>Travel Tips: </Text>
              <View style={styles.travelTipsPreview}>
                <TouchableHighlight onPress={this.navToTravelTips}>
                  <Text style={[
                    styles.travelTipsPreviewText,
                    workingDraft.travelTips ? {} : styles.travelTipsPreviewTextDimmed
                  ]}>
                    {workingDraft.travelTips || "What should your fellow travelers know?"}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        {modalVisible &&
        <View
          style={styles.dateWrapper}
          shadowColor='black'
          shadowOpacity={.9}
          shadowRadius={10}
          shadowOffset={{width: 0, height: 0}}>
          <View
            style={styles.dateView}>
            <DatePickerIOS
              date={dateLikeItemAsDate(workingDraft.tripDate)}
              mode="date"
              onDateChange={this._onDateChange}
            />
            <RoundedButton
              text='Confirm'
              onPress={this.confirmDate}
            />
          </View>
        </View> }
        {validationError &&
          <Tooltip
            onPress={this._touchError}
            position={"right-nav-button"}
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
    }
  },
  dispatch => ({
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
    publish: (story) => dispatch(StoryEditActions.publishLocalDraft(story)),
    update: (id, attrs) => dispatch(StoryEditActions.updateDraft(id, attrs, true)),
    resetCreateStore: () => dispatch(StoryEditActions.resetCreateStore())
  })
)(CreateStoryDetailScreen)
