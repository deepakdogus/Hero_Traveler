import React, { Component } from 'react'
import { View, Linking, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { Metrics, Fonts, Colors } from '../Shared/Themes'

import RoundedButton from './RoundedButton'

import { getButtonText, handleClickActionButton } from '../Shared/Lib/buttonLinkHelpers'

export default class StoryActionButton extends Component {
  static propTypes = {
    type: PropTypes.string,
    link: PropTypes.string,
  }

  openLink = link => Linking.openURL(link)

  render = () => (
    <View style={styles.actionButtonContainer}>
      <RoundedButton
        onPress={handleClickActionButton(this.props.link, this.openLink)}
        text={getButtonText(this.props.type)}
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
