import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Colors from '../Themes/Colors'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.redLight,
    position: 'absolute',
    top: -10,
    right: -10,
    borderRadius: 8,
    paddingHorizontal: 3,
    paddingVertical: 1
  },
  text: {
    color: Colors.white,
    fontSize: 9,
    marginRight: 1
  }
})

export default function NotificationBadge({count, style}) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.text}>{count}</Text>
    </View>
  )
}
