import React from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import R from 'ramda'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryCreateActions, {isCreated} from '../../Redux/StoryCreateRedux'
import RoundedButton from '../../Components/RoundedButton'
import styles from './CreateStoryScreenStyles'

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
        <ScrollView style={styles.containerWithNavbar}>
          <Text style={styles.title}>Create Story Detail</Text>
          <Text>Title {this.props.story.title}</Text>
          <Text>Description {this.props.story.description}</Text>
          <Text>My coverPhoto {this.props.story.coverPhoto}</Text>
          <RoundedButton onPress={() => this.props.publish(this.props.story)} text='Publish' />
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
