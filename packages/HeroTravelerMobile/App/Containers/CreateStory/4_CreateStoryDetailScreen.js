import _ from 'lodash'
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  DatePickerIOS,
  TextInput, KeyboardAvoidingView
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { reset as resetForm, Field, reduxForm, formValueSelector } from 'redux-form'
import {Actions as NavActions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import StoryEditActions, {isCreated, isPublishing} from '../../Redux/StoryCreateRedux'
import {Colors, Metrics} from '../../Themes'
import Loader from '../../Components/Loader'
import TabIcon from '../../Components/TabIcon'
import RoundedButton from '../../Components/RoundedButton'
import RenderTextInput from '../../Components/RenderTextInput'
import NavBar from './NavBar'
import styles from './4_CreateStoryDetailScreenStyles'

const Radio = ({text, onPress, name, selected}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.radio]}>
        <Icon
          name={selected ? 'circle' : 'circle-o'}
          style={styles.radioIcon}
          size={13}
          color={selected ? Colors.red : '#424242'}
        />
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
      type: props.story.type || 'eat',
      videoDescription: props.story.videoDescription || '',
      videoDescHeight: 0
    }
  }

  componentWillReceiveProps(newProps) {
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
        videoDescription: _.trim(this.state.videoDescription).slice(0, 500)
      })
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

  saveDraft = () => {

    const story = {
      ...this.props.story,
      location: _.trim(this.state.location),
      categories: this.state.categories,
      date: this.state.date,
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
    return !!this.props.story.coverVideo
  }

  render () {
    return (
      <View style={{flex: 1, position: 'relative'}}>
          <NavBar
            title='Story Details'
            leftIcon='arrowLeft'
            leftIconStyle={{image: { marginLeft: 10, paddingRight: -10, height: 15, width: 15 } }}
            leftTitle='Back'
            onLeft={this._onLeft}
            rightTitle={this.isDraft() ? 'Publish' : 'Save'}
            onRight={() => this._onRight()}
            rightTextStyle={{color: Colors.red}}

          />
          <ScrollView style={styles.root}>
            <Text style={styles.title}>{this.props.story.title} Details </Text>
            <View style={styles.videoDescriptionWrapper}>
              {this.isVideo() &&
                <TextInput
                  style={styles.videoDescription}
                  value={this.state.videoDescription}
                  onChangeText={this._changeVideoDescText}
                  placeholder='Add a description'
                  multiline={true}
                />
              }
            </View>
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
      story: {...state.storyCreate.draft}
    }
  },
  dispatch => ({
    publish: (story) => dispatch(StoryEditActions.publishDraft(story)),
    update: (id, attrs) => dispatch(StoryEditActions.updateDraft(id, attrs, true)),
    updateCategories: (cats) => dispatch(StoryEditActions.updateCategories(cats)),
    resetCreateStore: () => dispatch(StoryEditActions.resetCreateStore())
  })
)(CreateStoryDetailScreen)
