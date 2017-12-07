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
import moment from 'moment'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import StoryEditActions, {isCreated, isPublishing} from '../../Shared/Redux/StoryCreateRedux'
import {Colors, Metrics} from '../../Shared/Themes'
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
      date: props.workingDraft.tripDate ? moment(props.workingDraft.tripDate).toDate() : new Date(),
      location: props.workingDraft.location || '',
      categories: props.workingDraft.categories || [],
      type: props.workingDraft.type,
      showError: false,
    }
  }

  componentWillReceiveProps(newProps) {
    // making sure we properly display each of these properties
    const updates = {}
    // resetting values for a new story
    if (this.props.story.id !== newProps.story.id) {
      updates.categories = newProps.story.categories || []
      updates.location = undefined
      updates.type = ''
    }
    // setting the values when they are updated
    if (newProps.story.location) updates.location = newProps.story.location
    if (newProps.story.type) updates.type = newProps.story.type
    if (Object.keys(updates).length) this.setState(updates)

    if (!newProps.publishing && newProps.isCreated) {
      this.next()
    }
  }

  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible })
  }

  onLocationChange = (location) => {
    this.props.updateWorkingDraft({location})
  }

  _onDateChange = (date) => {
    this.props.updateWorkingDraft({date})
  }

  _onRight = () => {
    const {workingDraft} = this.props
    if (workingDraft.draft) {
      this.props.publish(_.merge({}, workingDraft, _.trim(workingDraft.location)))
      this.setState({showError: true})
    } else {
      this._update()
    }
  }

  _onLeft = () => {
    this.saveDraft()
    NavActions.pop()
  }

  _updateType = (type) => {
    this.props.updateWorkingDraft({type})
  }

  _update = () => {
    this.saveDraft()
    this.next()
  }

  _closeError = () => {
    this.setState({showError: false})
  }

  saveDraft = () => {
    const {workingDraft} = this.props
    const story = _.merge({}, workingDraft, _.trim(workingDraft.location))

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
    this.props.updateWorkingDraft({categories: selectedCategories})
    NavActions.pop()
  }

  isDraft() {
    return this.props.story.draft || false
  }



  render () {
    const {workingDraft} = this.props
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
            <View style={styles.fieldWrapper}>
              <TabIcon name='location' style={locationIconStyle} />
              <TextInput
                name='location'
                component={RenderTextInput}
                style={styles.inputStyle}
                placeholder='Location'
                placeholderTextColor={Colors.navBarText}
                value={workingDraft.location}
                onChangeText={this.onLocationChange}
                returnKeyType='done'
              />
            </View>
            <View style={styles.fieldWrapper} >
              <TabIcon name='date' style={dateIconStyle} />
              <TouchableHighlight
                onPress={() => this._setModalVisible(true)}
              >
                <Text style={styles.inputStyle}>
                  {workingDraft.date ? workingDraft.date.toDateString() : 'Add Date'}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={styles.fieldWrapper}>
              <TabIcon name='tag' style={tabIconStyle} />
              <TouchableWithoutFeedback
                onPress={() => NavActions.createStory_tags({
                  onDone: this._receiveCategories,
                  categories: workingDraft.categories || this.state.categories
                })}
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
              date={workingDraft.date || this.state.date}
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
      story: {...state.storyCreate.workingDraft},
      workingDraft: {...state.storyCreate.workingDraft},
      error: state.storyCreate.error,
    }
  },
  dispatch => ({
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
    publish: (story) => dispatch(StoryEditActions.publishDraft(story)),
    update: (id, attrs) => dispatch(StoryEditActions.updateDraft(id, attrs, true)),
    resetCreateStore: () => dispatch(StoryEditActions.resetCreateStore())
  })
)(CreateStoryDetailScreen)
