import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {ApplicationStyles, Colors} from '../Themes/'

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    ...ApplicationStyles.screen.titleText,
    color: Colors.navBarText
  }
})

export default function NoStoriesMessage({style, textStyle}) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={[styles.text, textStyle]}>There are no stories here</Text>
    </View>
  )
}
