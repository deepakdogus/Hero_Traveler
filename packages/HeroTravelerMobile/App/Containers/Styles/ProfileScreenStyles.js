import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

const avatarImageSize = 80

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    height: Metrics.screenHeight + Metrics.tabBarHeight
  },
  avatarImage: {
    width: avatarImageSize,
    height: avatarImageSize,
    borderRadius: avatarImageSize/2
  }
})
