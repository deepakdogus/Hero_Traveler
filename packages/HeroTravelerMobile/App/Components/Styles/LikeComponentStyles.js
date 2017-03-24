import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    color: Colors.snow,
    marginLeft: Metrics.baseMargin/2
  }
})
