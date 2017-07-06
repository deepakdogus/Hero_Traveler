import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics } from '../../Shared/Themes/'

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
