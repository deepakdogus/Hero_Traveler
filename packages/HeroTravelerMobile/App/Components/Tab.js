import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Colors, Fonts, Metrics } from '../Shared/Themes'

const styles = StyleSheet.create({
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: Metrics.screenWidth * 0.18,
    backgroundColor: Colors.feedDividerGrey,
    borderBottomWidth: 3,
    borderBottomColor: Colors.feedDividerGrey,
  },
  tabSelected: {
    borderBottomColor: Colors.red,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.navBarText,
    fontSize: 13,
    letterSpacing: 1.2,
    textAlign: 'center',
    fontWeight: '600',
  },
  tabTextSelected: {
    color: Colors.background,
  },
})

const Tab = ({ text, onPress, selected, style }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[
        styles.tab,
        selected ? styles.tabSelected : null,
        style
      ]}>
        <Text
          style={[
            styles.tabText,
            selected ? styles.tabTextSelected : null
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Tab
