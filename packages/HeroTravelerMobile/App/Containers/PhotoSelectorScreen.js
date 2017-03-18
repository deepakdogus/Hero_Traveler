import React from 'react'
import { View } from 'react-native'
import { reduxForm } from 'redux-form'
import { Actions as NavigationActions } from 'react-native-router-flux'
const ImagePicker = require('react-native-image-picker')

// Styles
import styles from './Styles/MyFeedScreenStyles'

class PhotoSelectorScreen extends React.Component {
  constructor (props) {
    super(props)
    this.handleSelectedPhoto = this.handleSelectedPhoto.bind(this)
  }

  componentWillMount () {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, this.handleSelectedPhoto)
  }

  handleSelectedPhoto (response) {
    this.props.change('coverPhoto', response.uri)
    NavigationActions.pop()
  }
  render () {
    return (
      <View style={styles.containerWithNavbar} />
    )
  }
}

export default reduxForm({
  form: 'createStory',
  destroyOnUnmount: false
})(PhotoSelectorScreen)
