import React, { Component } from 'react'
import { View, Linking, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Metrics, Fonts, Colors } from '../Shared/Themes'
import RoundedButton from './RoundedButton'

export default class StoryActionButton extends Component {
  static propTypes = {
    type: PropTypes.string,
    link: PropTypes.string,
  }

  getText = () => {
    switch (this.props.type) {
      case 'booking':
        return 'Book Now'
      case 'signup':
        return 'Sign Up'
      case 'info':
      default:
        return 'More Info'
    }
  }

  onPress = () => {
    const { link } = this.props
    Linking.canOpenURL(link).then(supported => {
      if (!supported) return
      if (link.substring(0, 7) !== 'http://' || link.substring(0, 8) !== 'https://') {
        return Linking.openURL(`http://${link}`)
      }
      Linking.openURL(`http://${link}`)
    })
  }

  render = () => (
    <View style={styles.actionButtonContainer}>
      <RoundedButton
        onPress={this.onPress}
        text={this.getText()}
        textStyle={styles.text}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  actionButtonContainer: {
    marginVertical: Metrics.doubleBaseMargin * 2,
  },
  text: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '600',
    fontSize: 18,
    color: Colors.snow,
  },
})
