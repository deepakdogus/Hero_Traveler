import React from 'react'
import PropTypes from 'prop-types'
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
    backgroundColor: Colors.snow,
    borderBottomWidth: 3,
    borderBottomColor: Colors.snow,
    padding: 0,
  },
  tabSelected: {
    paddingBottom: 2,
    borderBottomColor: Colors.red,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.navBarText,
    fontSize: 12,
    letterSpacing: 1.2,
    textAlign: 'center',
    fontWeight: '600',
  },
  tabTextSelected: {
    color: Colors.background,
  },
})

const Tab = ({ text, onPress, selected, style }) => (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[
        styles.tab,
        selected ? styles.tabSelected : null,
        style,
      ]}>
        <Text
          style={[
            styles.tabText,
            selected ? styles.tabTextSelected : null,
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )

Tab.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  style: PropTypes.number,
}

export default Tab
