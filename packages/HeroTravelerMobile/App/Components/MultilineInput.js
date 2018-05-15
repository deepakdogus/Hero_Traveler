import React from 'react'
import { Text, TextInput, View, StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../Shared/Themes'

const MultilineInput = ({ label, placeholder, value, onChangeText }) => (
  <View style={styles.multilineContainer}>
    <Text style={styles.multilineLabel}>{label}</Text>
    <TextInput
      multiline={true}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={styles.multilineTextInput}
    />
  </View>
)
export default MultilineInput

const styles = StyleSheet.create({
  multilineContainer: {
    marginBottom: Metrics.doubleBaseMargin,
  },
  multilineLabel: {
    fontFamily: Fonts.type.bold,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: Metrics.baseMargin,
  },
  multilineTextInput: {
    borderWidth: 1,
    borderColor: Colors.navBarText,
    padding: Metrics.baseMargin,
    flex: 1,
    color: Colors.background,
    fontSize: 16,
    marginBottom: 10,
    minHeight: 90,
  },
})
