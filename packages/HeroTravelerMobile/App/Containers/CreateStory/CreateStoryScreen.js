import React from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'

import { Images } from '../../Themes'
import styles from './CreateStoryScreenStyles'

class CreateStoryScreen extends React.Component {

  render () {
    return (
      <ScrollView
        style={[styles.container, styles.root]}
        contentContainerStyle={{flex: 1, alignItems: 'center'}}
      >
        <Image source={Images.whiteLogo} style={styles.logoImage} />
        <Image source={Images.createStory} style={styles.storyImage} />
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => NavActions.createStory_photo()}
          >
            <Icon
              name='file-word-o'
              size={40}
              color='white'
            />
            <Text style={[styles.lightText, styles.buttonText]}>CREATE STORY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
          >
            <Icon
              name='video-camera'
              size={40}
              color='white'
            />
            <Text style={[styles.lightText, styles.buttonText]}>CREATE VIDEO</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fakeTabbar}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => NavActions.pop()}>
            <Icon
              name='close'
              size={20}
              color='white'
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

export default connect(state => ({

}))(CreateStoryScreen)
