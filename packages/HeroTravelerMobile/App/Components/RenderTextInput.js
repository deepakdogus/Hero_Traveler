import React from 'react'
import { TextInput } from 'react-native'

const RenderTextInput = ({input, meta, ...custom}) => {
  return <TextInput
    onChangeText={input.onChange}
    value={input.value}
    {...custom}
  />
}

export default RenderTextInput
