import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import detailsStyles from '../Containers/CreateStory/4_CreateStoryDetailScreenStyles'

const MultilineInput = ({label, placeholder, value, onPress}) => (
  <View style={detailsStyles.travelTipsWrapper}>
    <Text style={detailsStyles.fieldLabel}>{label}</Text>
    <View style={detailsStyles.travelTipsPreview}>
      <TouchableOpacity onPress={onPress}>
        <Text style={[
          detailsStyles.travelTipsPreviewText,
          value ? {} : detailsStyles.travelTipsPreviewTextDimmed
        ]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)

export default MultilineInput
