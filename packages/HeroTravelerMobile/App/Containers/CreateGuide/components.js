import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Fonts, Images, Colors, Metrics } from '../../Shared/Themes'
import styles from './components.style'
const {
  multilineContainer,
  multilineLabel,
  multilineTextInput,
  checkboxContent,
  checkboxMark,
  checkboxLabel,
  form,
} = styles

const MultilineInput = ({ label, placeholder, value, onChangeText }) => (
  <View style={multilineContainer}>
    <Text style={multilineLabel}>{label}</Text>
    <TextInput
      multiline={true}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={multilineTextInput}
    />
  </View>
)

const Checkbox = ({ checked, onPress, label }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={checkboxContent}>
      <Image
        style={checkboxMark}
        source={checked ? Images.iconRedCheck : Images.iconGreyCheck}
      />
      <Text style={checkboxLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
)

const Form = ({ children }) => <View style={form}>{children}</View>

export { Checkbox, Form, MultilineInput }
