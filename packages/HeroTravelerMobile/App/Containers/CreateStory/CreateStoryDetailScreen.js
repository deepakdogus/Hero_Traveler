import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import R from 'ramda'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import {Actions as NavActions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import StoryCreateActions, {isCreated} from '../../Redux/StoryCreateRedux'
import {Colors} from '../../Themes'
import RoundedButton from '../../Components/RoundedButton'
import RenderTextInput from '../../Components/RenderTextInput'
import styles from './CreateStoryDetailScreenStyles'

class CreateStoryDetailScreen extends React.Component {

  static defaultProps = {
    story: {}
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.publishing && newProps.isCreated) {
      NavActions.profile({type: 'replace'})
    }
  }

  render () {
    return (
        <ScrollView style={[styles.containerWithNavbar, styles.root]}>
          <Text style={styles.title}>{this.props.story.title} Details</Text>
          <View style={styles.fieldWrapper}>
            <Icon name='map-marker' size={18} color='#424242' style={styles.fieldIcon} />
            <Field
              name='location'
              component={TextInput}
              style={styles.inputStyle}
              placeholder='Location'
              placeholderTextColor={Colors.navBarText}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <Icon name='calendar-o' size={18} color='#424242' style={styles.fieldIcon} />
            <Field
              name='date'
              component={TextInput}
              style={styles.inputStyle}
              placeholder='Date'
              placeholderTextColor={Colors.navBarText}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <Icon name='tag' size={18} color='#424242' style={styles.fieldIcon} />
            <Field
              name='tags'
              component={TextInput}
              style={styles.inputStyle}
              placeholder='Add tags'
              placeholderTextColor={Colors.navBarText}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <Icon name='hashtag' size={18} color='#424242' style={styles.fieldIcon} />
            <Field
              name='tags'
              component={TextInput}
              style={styles.inputStyle}
              placeholder='Add hashtags'
              placeholderTextColor={Colors.navBarText}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Category: </Text>
          </View>
          <RoundedButton onPress={() => alert('Finish publish')} text='Publish' />
        </ScrollView>
    )
  }
}


const selector = formValueSelector('createStory')
export default R.compose(
  connect(
    state => ({
      isCreated: isCreated(state.storyCreate),
      story: {
        title: selector(state, 'title'),
        description: selector(state, 'description'),
        coverPhoto: selector(state, 'coverPhoto'),
      }
    }),
    dispatch => ({
      publish: (story) => dispatch(StoryCreateActions.publishRequest(story))
    })
  ),
  reduxForm({
    form: 'createStory',
    destoryOnUnmount: true
  })
)(CreateStoryDetailScreen)
