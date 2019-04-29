import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../Shared/Themes/'

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 100,
  },
  text: {
    ...ApplicationStyles.screen.titleText,
    textAlign: 'center',
    color: Colors.navBarText,
  },
})

export default function NoStoriesMessage({ style, textStyle, text }) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  )
}

NoStoriesMessage.propTypes = {
  style: PropTypes.number,
  textStyle: PropTypes.number,
  text: PropTypes.string,
}
