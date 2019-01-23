import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Colors from '../Shared/Themes/Colors'

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.redLight,
    borderRadius: 6,
    position: 'absolute',
    top: 5,
    right: 2.5,
    height: 12,
    width: 12,
  },
  doubleDigits: {
    width: 14,
    right: 0,
  },
  tripleDigits: {
    width: 18,
    right: -2.5,
  },
  maximum: {
    width: 22,
    right: -5,
  },
  text: {
    color: Colors.snow,
    fontSize: 9,
  },
})

export default function NotificationBadge({count, style}) {
  return (
    <View style={[
      styles.wrapper,
      count > 9 && styles.doubleDigits,
      count > 99 && styles.tripleDigits,
      count > 999 && styles.maximum,
      style,
    ]}>
      <Text style={styles.text}>{count > 999 ? '999+' : count}</Text>
    </View>
  )
}
