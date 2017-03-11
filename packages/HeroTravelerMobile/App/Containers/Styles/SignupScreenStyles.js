import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.windowTint
  },
  title: {
    ...Fonts.style.title,
    marginTop: Metrics.marginVertical,
    color: Colors.snow,
    textAlign: 'center'
  },
  instructions: {
    ...Fonts.style.instructions,
    marginTop: Metrics.marginVertical,
    textAlign: 'center'
  },
  social: {
    marginTop: Metrics.doubleBaseMargin
  },
  twitter: {
    marginTop: 0,
    backgroundColor: Colors.twitterBlue
  },
  facebook: {
    margin: 0,
    backgroundColor: Colors.facebookBlue
  }
})
