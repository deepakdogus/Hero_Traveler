import React from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Colors, Fonts } from '../Shared/Themes'

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: width * 0.18,
    backgroundColor: Colors.feedDividerGrey,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.navBarText,
    fontSize: 13,
    letterSpacing: 1.2,
    textAlign: 'center',
    fontWeight: '600',
  },
  tabActiveMarker: {
    backgroundColor: Colors.red,
    width: '100%',
    height: 4,
    position: 'absolute',
    bottom: -1,
    zIndex: 1,
  },
  tabTextSelected: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 13,
    letterSpacing: 1.2,
  },
})

const Tab = ({ text, onPress, selected, tabStyles }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.tab, tabStyles]}>
        <Text
          style={[styles.tabText, selected ? styles.tabTextSelected : null]}>
          {text}
        </Text>
        {selected && (<View style={styles.tabActiveMarker}/>)}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Tab
