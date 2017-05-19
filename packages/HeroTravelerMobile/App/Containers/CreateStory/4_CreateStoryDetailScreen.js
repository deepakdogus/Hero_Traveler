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


class CreateStoryDetailScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      date: props.story.tripDate ? moment(props.story.tripDate).toDate() : new Date(),
      location: props.story.location || '',
      categories: props.story.categories|| [],
      type: props.story.type || 'eat'
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.publishing && newProps.isCreated) {
      NavActions.tabbar({type: 'reset'})
      NavActions.profile()
      this.props.resetCreateStore()
    }
  }

  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible })
  }

  _onDateChange = (date) => {
    console.log('date', date)
    this.setState({date: date})
  }

  _publish = () => {
    this.props.publish({...this.props.story})
  }

  _updateType = (type) => {
    this.setState({type})
  }

  _update = () => {
    const story = {
      ...this.props.story,
      location: _.trim(this.state.location),
      categories: this.state.categories,
      date: this.state.date
    }

    console.log('updating story', story.location)

    this.props.update(
      this.props.story.id,
      story,
      true
    )

    this.next()
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

  isDraft() {
    return this.props.story.draft || false
  }

  render () {
    return (
      <View style={{flex: 1, position: 'relative'}}>
          <NavBar
            title='Story Details'
            leftTitle='Back'
            onLeft={() => NavActions.pop()}
            rightTitle={this.isDraft() ? 'Publish' : 'Save'}
            onRight={() => this._publish()}
          />
          <ScrollView style={styles.root}>
            <Text style={styles.title}>{this.props.story.title} Details </Text>
            <View style={styles.fieldWrapper}>
              <Icon name='map-marker' size={18} color='#424242' style={styles.fieldIcon} />
              <TextInput
                name='location'
                component={RenderTextInput}
                style={styles.inputStyle}
                placeholder='Location'
                placeholderTextColor={Colors.navBarText}
                value={this.state.location}
                onChangeText={location => this.setState({location})}
              />
            </View>
            <View style={styles.fieldWrapper} >
              <Icon name='calendar' size={18} color='#424242' style={styles.fieldIcon} />
              <TouchableHighlight
                onPress={() => this._setModalVisible(true)}
              >
                <Text style={styles.inputStyle}>{this.state.date ? this.state.date.toDateString() : 'Add Date'}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.fieldWrapper}>
              <Icon name='tag' size={18} color='#424242' style={styles.fieldIcon} />
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
              <Text style={styles.fieldLabel}>Category: </Text>
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
            {this.isDraft() &&
              <View style={styles.finishButtons}>
                <RoundedButton
                  style={[
                    styles.finishButton,
                    {marginRight: Metrics.section},
                    styles.draftButton
                  ]}
                  textStyle={styles.draftButtonText}
                  onPress={this._update}
                  text='Save Draft'
                />
                <RoundedButton
                  style={styles.finishButton}
                  onPress={this._publish}
                  text='Publish'
                />
              </View>
            }
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
