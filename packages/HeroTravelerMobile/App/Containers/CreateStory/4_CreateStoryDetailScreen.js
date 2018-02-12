import _ from 'lodash'
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  DatePickerIOS,
} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import {getNewCover, saveCover} from './shared'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import StoryEditActions, {isCreated, isPublishing} from '../../Shared/Redux/StoryCreateRedux'
import {Colors, Metrics} from '../../Shared/Themes'
import Loader from '../../Components/Loader'
import ShadowButton from '../../Components/ShadowButton'
import TabIcon from '../../Components/TabIcon'
import RoundedButton from '../../Components/RoundedButton'
import NavBar from './NavBar'
import styles from './4_CreateStoryDetailScreenStyles'
import API from '../../Shared/Services/HeroAPI'
import {displayLocation} from '../../Shared/Lib/locationHelpers'
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

const locationIconStyle = {
  image: {
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    width: 14,
    height: 22,
  }
}

const dateIconStyle = {
  image: {
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    width: 18,
    height: 18,
  }
}

const tabIconStyle = {
  image: {
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    width: 18,
    height: 18
  }
}


class CreateStoryDetailScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      categories: props.workingDraft.categories || [],
      type: props.workingDraft.type,
      showError: false,
    }
  }

  componentWillMount() {
    api.setAuth(this.props.accessToken.value)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.error){
      this.setState({ showError: true })
      return
    }
    if (!newProps.publishing && newProps.isCreated) {
      this.next()
    }
    if (this.props.isRepublishing && !newProps.isRepublishing){
      this.next()
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
    const newCover = getNewCover(workingDraft.coverImage, workingDraft.coverVideo)
    let promise
    if (newCover) {
      this.setState({isSavingCover: true})
      promise = saveCover(api, workingDraft, newCover)
      .then(draft => {
        this.setState({isSavingCover: false})
        return draft
      })
    }
    else promise = Promise.resolve(workingDraft)

    return promise.then(draft => {
      if (draft.draft) {
        this.props.publish(_.merge({}, draft, _.trim(draft.location)))
        this.setState({showError: true})
      } else {
        this._update(draft)
      }
    })
  }

  _onLeft = () => {
    const location = this.props.workingDraft.location
    const cleanedLocation = _.trim(location)
    if (cleanedLocation !== location) this.props.updateWorkingDraft({location})
    NavActions.pop()
  }

  _updateType = (type) => {
    this.props.updateWorkingDraft({type})
  }

  _update = (draft) => {
    this.saveDraft(draft)
    // rather than calling this.next() now, we will let componentWillReceiveProps handle that
    // so that we do not run into race condition on backend
  }

  _closeError = () => {
    this.setState({showError: false})
  }

  saveDraft = (draft) => {
    const story = _.merge({}, draft, {location: _.trim(draft.location)})
    this.props.update(
      draft.id,
      story
    )
  }

  next() {
    this.props.resetCreateStore()
    NavActions.tabbar({type: 'reset'})
    NavActions.profile()
  }

  _receiveCategories = (selectedCategories) => {
    this.props.updateWorkingDraft({categories: selectedCategories})
    NavActions.pop()
  }

  isDraft() {
    return this.props.story.draft || false
  }

  navToTags = () => {
    NavActions.createStory_tags({
      onDone: this._receiveCategories,
      categories: this.props.workingDraft.categories || this.state.categories
    })
  }

  receiveLocation = (place) => {
    this.props.updateWorkingDraft({
      location: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
    })
    NavActions.pop()
  }

  navToLocation = () => {
    NavActions.createStory_location({
      navBack: NavActions.pop,
      onSelectLocation: this.receiveLocation,
      location: this.props.workingDraft.location,
    })
  }

  render () {
    const {workingDraft, publishing} = this.props
    const {isSavingCover, categories, modalVisible, showError} = this.state
    const err = this.props.error
    const errText = (__DEV__ && err && err.problem && err.status) ? `${err.status}: ${err.problem}` : ""

    return (
      <View style={{flex: 1, position: 'relative'}}>
          { showError && err &&
          <ShadowButton
            style={styles.errorButton}
            onPress={this._closeError}
            text={errText}
            title={err.message}
          />
          }
          <NavBar
            title='Story Details'
            leftIcon='arrowLeftRed'
            leftTitle='Back'
            onLeft={this._onLeft}
            leftTextStyle={{paddingLeft: 10}}
            onRight={() => this._onRight()}
            rightTitle={this.isDraft() ? 'Publish' : 'Save'}
            rightTextStyle={{color: Colors.red}}
          />
          <ScrollView style={styles.root}>
            <Text style={styles.title}>{this.props.story.title} Details </Text>
            <View style={styles.fieldWrapper}>
              <TabIcon name='location' style={locationIconStyle} />
              <TouchableWithoutFeedback onPress={this.navToLocation}>
                <View>
                  <Text
                    style={[
                      styles.inputStyle,
                      workingDraft.location ? null : {color: Colors.navBarText}
                    ]}
                    placeholder='Location'
                    placeholderTextColor={Colors.navBarText}
                    value={workingDraft.locationInfo ? displayLocation(workingDraft.locationInfo) : ''}
                  >
                    {
                      workingDraft.locationInfo ?
                      displayLocation(workingDraft.locationInfo) :
                      'Location'
                    }
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.fieldWrapper} >
              <TabIcon name='date' style={dateIconStyle} />
              <TouchableHighlight
                onPress={() => this._setModalVisible(true)}
              >
                <Text style={styles.inputStyle}>
                  {dateLikeItemAsDateString(workingDraft.tripDate)}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={styles.fieldWrapper}>
              <TabIcon name='tag' style={tabIconStyle} />
              <TouchableWithoutFeedback
                onPress={this.navToTags}
                style={styles.tagStyle}
              >
                <View>
                  {_.size(workingDraft.categories) > 0 && <Text style={styles.tagStyleText}>{_.map(workingDraft.categories, 'title').join(', ')}</Text>}
                  {_.size(workingDraft.categories) === 0 && <Text style={[styles.tagStyleText, {color: '#bdbdbd'}]}>Add categories...</Text>}
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Activity: </Text>
              <View style={styles.radioGroup}>
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
                <Radio
                  style={{marginLeft: Metrics.baseMargin}}
                  selected={workingDraft.type === 'do'}
                  onPress={() => this._updateType('do')}
                  text='DO'
                />
              </View>
            </View>
          </ScrollView>
          {(publishing || isSavingCover) &&
            <Loader style={styles.loader} tintColor={Colors.blackoutTint} />
          }
        {modalVisible &&
        <View
          style={{position: 'absolute', top: 250, left: 40, elevation: 100}}
          shadowColor='black'
          shadowOpacity={.9}
          shadowRadius={10}
          shadowOffset={{width: 0, height: 0}}>
          <View
            style={{ backgroundColor: 'white', height: 300, width: 300 }}>
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
      </View>
    )
  }
}


export default connect(
  (state) => {
    return {
      accessToken: _.find(state.session.tokens, {type: 'access'}),
      publishing: isPublishing(state.storyCreate),
      isCreated: isCreated(state.storyCreate),
      story: {...state.storyCreate.workingDraft},
      workingDraft: {...state.storyCreate.workingDraft},
      error: state.storyCreate.error,
      isRepublishing: state.storyCreate.isRepublishing,
    }
  },
  dispatch => ({
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
    publish: (story) => dispatch(StoryEditActions.publishDraft(story)),
    update: (id, attrs) => dispatch(StoryEditActions.updateDraft(id, attrs, true)),
    resetCreateStore: () => dispatch(StoryEditActions.resetCreateStore())
  })
)(CreateStoryDetailScreen)
