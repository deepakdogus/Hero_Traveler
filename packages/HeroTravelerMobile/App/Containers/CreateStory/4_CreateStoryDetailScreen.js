import _ from 'lodash'
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight,
  DatePickerIOS
} from 'react-native'
import { connect } from 'react-redux'
import R from 'ramda'
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

  static defaultProps = {
    story: {
      tripDate: new Date()
    },
    date: new Date()
  }

  state = {
    date: this.props.date
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.publishing && newProps.isCreated) {
      NavActions.tabbar({type: 'reset'})
      this.props.resetForm()
    }
  }

  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible })
  }

  _onDateChange = (date) => {
    this.setState({date: date})
    this.props.story.tripDate = date
  }

  _publish = () => {
    this.props.publish(this.props.story)
  }

  _updateType = (type) => {
    this.props.change('type', type)
  }

  _update = () => {
    const story = {
      ...this.props.story
    }
    this.props.update(
      this.props.story.id,
      story
    )
    NavActions.tabbar({type: 'reset'})
    this.props.resetForm()
  }

  render () {
    return (
      <View style={{flex: 1, position: 'relative'}}>
          <NavBar
            title='Story Details'
            leftTitle='Back'
            onLeft={() => NavActions.pop()}
            rightTitle='Publish'
            onRight={() => this._publish()}
          />
          <ScrollView style={styles.root}>
            <Text style={styles.title}>{this.props.story.title} Details </Text>
            <View style={styles.fieldWrapper}>
              <Icon name='map-marker' size={18} color='#424242' style={styles.fieldIcon} />
              <Field
                name='location'
                component={RenderTextInput}
                style={styles.inputStyle}
                placeholder='Location'
                placeholderTextColor={Colors.navBarText}
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
              <Field
                name='tags'
                component={RenderTextInput}
                style={styles.inputStyle}
                placeholder='Add tags'
                placeholderTextColor={Colors.navBarText}
              />
            </View>
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Category: </Text>
              <View style={styles.radioGroup}>
                <Radio
                  selected={this.props.story.type === 'eat'}
                  onPress={() => this._updateType('eat')}
                  text='EAT'
                />
                <Radio
                  style={{marginLeft: Metrics.baseMargin}}
                  selected={this.props.story.type === 'stay'}
                  onPress={() => this._updateType('stay')}
                  text='STAY'
                />
                <Radio
                  style={{marginLeft: Metrics.baseMargin}}
                  selected={this.props.story.type === 'do'}
                  onPress={() => this._updateType('do')}
                  text='DO'
                />
              </View>
            </View>
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


const selector = formValueSelector('createStory')
export default R.compose(
  connect(
    (state) => {
      const draft = state.storyCreate.draft ? state.storyCreate.draft : {}
      return {
        publishing: isPublishing(state.storyCreate),
        isCreated: isCreated(state.storyCreate),
        story: {
          ...draft,
          title: selector(state, 'title'),
          category: _.values(state.entities.stories.entities)[0].category,
          type: selector(state, 'type') || draft.type,
          location: selector(state, 'location'),
          content: selector(state, 'content'),
        },
        tags: selector(state, 'tags')
      }
    },
    dispatch => ({
      publish: (story) => dispatch(StoryEditActions.publishDraft(story)),
      update: (id, attrs) => dispatch(StoryEditActions.updateDraft(id, attrs, true)),
      resetForm: () => dispatch(resetForm('createStory')),

    })
  ),
  reduxForm({
    form: 'createStory',
    destroyOnUnmount: true,
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    initialValues: {
      type: '',
      tags: ''
    }
  })
)(CreateStoryDetailScreen)
