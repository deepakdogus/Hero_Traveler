import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Metrics } from '../Shared/Themes'


const Form = ({ children }) =>
  <View style={styles.form}>
    {children}
  </View>

const styles = StyleSheet.create({
  form: {
    padding: Metrics.doubleBaseMargin,
    paddingTop: 2 * Metrics.doubleBaseMargin,
  }
})

export default Form
