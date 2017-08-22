import _ from 'lodash'
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  DatePickerIOS,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { reset as resetForm, Field, reduxForm, formValueSelector } from 'redux-form'
import {Actions as NavActions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import StoryEditActions, {isCreated, isPublishing} from '../../Redux/StoryCreateRedux'
import {Colors, Metrics} from '../../Themes'
import Loader from '../../Components/Loader'
import ShadowButton from '../../Components/ShadowButton'
import TabIcon from '../../Components/TabIcon'
import RoundedButton from '../../Components/RoundedButton'
import RenderTextInput from '../../Components/RenderTextInput'
import NavBar from './NavBar'
import styles from './4_CreateStoryDetailScreenStyles'

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
      date: props.story.tripDate ? moment(props.story.tripDate).toDate() : new Date(),
      location: props.story.location || '',
      categories: props.story.categories || [],
      type: props.story.type,
      videoDescription: props.story.videoDescription || '',
      videoDescHeight: 0,
      showError: false,
    }
  }

  componentWillReceiveProps(newProps) {
    // making sure we properly display each of these properties
    const updates = {}
    // resetting values for a new story
    if (this.props.story.id !== newProps.story.id) {
      updates.categories = []
      updates.videoDescription = ''
      updates.location = undefined
      updates.type = ''
    }
    // setting the values when they are updated
    if (newProps.story.categories) updates.categories = newProps.story.categories
    if (newProps.story.location) updates.location = newProps.story.location
    if (newProps.story.type) updates.type = newProps.story.type
    if (newProps.story.videoDescription) updates.videoDescription = newProps.story.videoDescription
    if (Object.keys(updates).length) this.setState(updates)

    if (!newProps.publishing && newProps.isCreated) {
      this.next()
    }
  }

  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible })
  }

  _onDateChange = (date) => {
    this.setState({date: date})
  }

  _onRight = () => {
    if (this.props.story.draft) {
      this.props.publish({
        ...this.props.story,
        location: _.trim(this.state.location),
        categories: this.state.categories,
        date: this.state.date,
        type: this.state.type,
        videoDescription: _.trim(this.state.videoDescription).slice(0, 500)
      })
      this.state.showError = true
    } else {
      this._update()
    }
  }

  _onLeft = () => {
    this.saveDraft()
    NavActions.pop()
  }

  _updateType = (type) => {
    this.setState({type})
  }

  _update = () => {
    this.saveDraft()
    this.next()
  }

  _closeError = () => {
    this.setState({showError: false})
  }

  saveDraft = () => {

    const story = {
      ...this.props.story,
      location: _.trim(this.state.location),
      categories: this.state.categories,
      date: this.state.date,
      type: this.state.type,
      videoDescription: _.trim(this.state.videoDescription).slice(0, 500)
    }

    this.props.update(
      this.props.story.id,
      story
    )
  }

  next() {
    this.props.resetCreateStore()
    NavActions.tabbar({type: 'reset'})
    NavActions.profile()
  }

  _receiveCategories = (selectedCategories) => {
    // this.props.updateCategories(selectedCategories)
    this.setState({categories: selectedCategories})
    NavActions.pop()
  }

  // _changeVideoDesc = (event) => {
  //   this.setState({
  //     videoDescription: event.nativeEvent.text,
  //     videoDescHeight: event.nativeEvent.contentSize.height
  //   })
  // }

  _changeVideoDescText = (videoDescription) => {
    this.setState({videoDescription})
  }

  isDraft() {
    return this.props.story.draft || false
  }

  isVideo() {
    return _.has(this.props.story, 'coverVideo')
  }

  render () {
    const err = this.props.error
    const errText = (__DEV__ && err && err.problem && err.status) ? `${err.status}: ${err.problem}` : ""
    return (
      <View style={{flex: 1, position: 'relative'}}>
          { this.state.showError && err &&
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
            {this.isVideo() &&
              <View style={styles.videoDescriptionWrapper}>
                <TextInput
                  style={styles.videoDescription}
                  value={this.state.videoDescription}
                  onChangeText={this._changeVideoDescText}
                  placeholder='Add a description'
                  multiline={true}
                />
              </View>
            }
            <View style={styles.fieldWrapper}>
              <TabIcon name='location' style={locationIconStyle} />
              <TextInput
                name='location'
                component={RenderTextInput}
                style={styles.inputStyle}
                placeholder='Location'
                placeholderTextColor={Colors.navBarText}
                value={this.state.location}
                onChangeText={location => this.setState({location})}
                returnKeyType='done'
              />
            </View>
            <View style={styles.fieldWrapper} >
              <TabIcon name='date' style={dateIconStyle} />
              <TouchableHighlight
                onPress={() => this._setModalVisible(true)}
              >
                <Text style={styles.inputStyle}>{this.state.date ? this.state.date.toDateString() : 'Add Date'}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.fieldWrapper}>
              <TabIcon name='tag' style={tabIconStyle} />
              <TouchableWithoutFeedback
                onPress={() => NavActions.createStory_tags({
                  onDone: this._receiveCategories,
                  categories: this.state.categories
                })}
                style={styles.tagStyle}
              >
                <View>
                  {_.size(this.state.categories) > 0 && <Text style={styles.tagStyleText}>{_.map(this.state.categories, 'title').join(', ')}</Text>}
                  {_.size(this.state.categories) === 0 && <Text style={[styles.tagStyleText, {color: '#bdbdbd'}]}>Add tags...</Text>}
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Activity: </Text>
              <View style={styles.radioGroup}>
                <Radio
                  selected={this.state.type === 'eat'}
                  onPress={() => this._updateType('eat')}
                  text='EAT'
                />
                <Radio
                  style={{marginLeft: Metrics.baseMargin}}
                  selected={this.state.type === 'stay'}
                  onPress={() => this._updateType('stay')}
                  text='STAY'
                />
                <Radio
                  style={{marginLeft: Metrics.baseMargin}}
                  selected={this.state.type === 'do'}
                  onPress={() => this._updateType('do')}
                  text='DO'
                />
              </View>
            </View>
            {!this.isDraft() &&
              <View style={styles.finishButtons}>
                <RoundedButton
                  style={styles.finishButton}
                  onPress={this._update}
                  text='Save Story'
                />
              </View>
            }
          </ScrollView>
          {this.props.publishing && <Loader style={styles.loader} tintColor={Colors.blackoutTint} />}
      { this.state.modalVisible &&
        <View
          style={{position: 'absolute', top: 250, left: 40, elevation: 100}}
          shadowColor='black'
          shadowOpacity={.9}
          shadowRadius={10}
          shadowOffset={{width: 0, height: 0}}>
          <View
            style={{ backgroundColor: 'white', height: 300, width: 300 }}>
            <DatePickerIOS
              date={this.state.date}
              mode="date"
              onDateChange={this._onDateChange}
            />
            <RoundedButton
              text='Confirm'
              onPress={() => this._setModalVisible(!this.state.modalVisible)}
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
      publishing: isPublishing(state.storyCreate),
      isCreated: isCreated(state.storyCreate),
      story: {...state.storyCreate.draft},
      error: state.storyCreate.error,
    }
  },
  dispatch => ({
    publish: (story) => dispatch(StoryEditActions.publishDraft(story)),
    update: (id, attrs) => dispatch(StoryEditActions.updateDraft(id, attrs, true)),
    updateCategories: (cats) => dispatch(StoryEditActions.updateCategories(cats)),
    resetCreateStore: () => dispatch(StoryEditActions.resetCreateStore())
  })
)(CreateStoryDetailScreen)
