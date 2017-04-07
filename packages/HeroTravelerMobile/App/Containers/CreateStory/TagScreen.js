import _ from 'lodash'
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native'
import { connect } from 'react-redux'
import R from 'ramda'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import {Actions as NavActions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import StoryEditActions, {isCreated} from '../../Redux/StoryCreateRedux'
import {Colors, Metrics} from '../../Themes'
import RenderTextInput from '../../Components/RenderTextInput'
import styles from './CreateStoryDetailScreenStyles'

class TagScreen extends React.Component {

  static defaultProps = {
    story: {}
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.publishing && newProps.isCreated) {
      NavActions.profile({type: 'replace'})
    }
  }

  _publish = () => {
    alert('publishing!')
  }

  _updateType = (type) => {
    this.props.change('type', type)
  }

  _update = () => {
    const story = {
      ...this.props.story
      // @TODO add tags
    }
    this.props.update(
      this.props.story.id,
      story
    )
    NavActions.pop()
  }

  render () {
    return (
        <View style={{flex: 1}}>
          <NavBar
            title='Story Details'
            leftTitle='Back'
            onLeft={NavActions.pop}
            rightTitle='Publish'
            onRight={this._publish}
          />
          <ScrollView style={styles.root}>
            <Text>Tags!</Text>
          </ScrollView>
        </View>
    )
  }
}


const selector = formValueSelector('createStory')
export default R.compose(
  connect(
    state => ({
      tags: selector(state, 'tags')
    }),
    // dispatch => ({
    //   publish: (story) => dispatch(StoryEditActions.publishRequest(story)),
    //   update: (id, attrs) => dispatch(StoryEditActions.updateDraft(id, attrs))
    // })
  ),
  reduxForm({
    form: 'createStory'
  })
)(TagScreen)
