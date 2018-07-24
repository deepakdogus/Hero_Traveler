import React from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import { Images, Fonts, Metrics } from '../Shared/Themes'

const Checkbox = ({ checked, onPress, label }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.checkboxContent}>
      <Image
        style={styles.checkboxMark}
        source={checked ? Images.iconRedCheck : Images.iconGreyCheck}
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  checkboxContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  checkboxMark: {
    height: 25,
    width: 25,
    resizeMode: 'cover',
    marginRight: Metrics.baseMargin,
  },
  checkboxLabel: {
    fontFamily: Fonts.type.bold,
    fontWeight: '600',
    fontSize: 16,
  },
})

export default Checkbox
