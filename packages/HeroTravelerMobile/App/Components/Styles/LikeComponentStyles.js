import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    color: Colors.snow,
    marginRight: Metrics.baseMargin / 2,
    fontSize: 13
  },
  isRightText: {
    color: Colors.signupGrey,
    marginRight: 0,
    marginLeft: Metrics.baseMargin / 2,
  },
  heartIcon: {
    width: 22,
    height: 19,
  }
})
