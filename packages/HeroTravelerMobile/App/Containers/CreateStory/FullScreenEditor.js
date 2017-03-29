import React from 'react'
import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Image } from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import R from 'ramda'

import Editor from '../../Components/Editor'
import styles from './FullScreenEditorStyles'

class FullScreenEditor extends React.Component {

  render () {
    return (
      <View style={[styles.root]}>
        <Editor />
      </View>
    )
  }
}

const selector = formValueSelector('createStory')
export default R.compose(
  connect(state => ({
    story: {
    }
    // state: state
  })),
  reduxForm({
    form: 'createStory',
    destoryOnUnmount: false,
    initialValues: {
      title: '',
      description: '',
      coverPhoto: null
    }
  })
)(FullScreenEditor)
