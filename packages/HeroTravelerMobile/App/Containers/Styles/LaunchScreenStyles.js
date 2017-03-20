import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  logoSection: {
    margin: Metrics.section,
    marginTop: 75,
    flex: 1,
    alignItems: 'center'
  },
  logo: {
    height: 100,
    width: 300,
    resizeMode: 'contain'
  },
  tagline: {
    ...Fonts.style.h5,
    color: Colors.snow,
    textAlign: 'center',
    fontWeight: '300',
    width: '75%'
  },
  spacer: {
    flexGrow: 10
  },
  twitter: {
    marginTop: 0,
    backgroundColor: Colors.twitterBlue
  },
  email: {
    marginTop: 0,
    backgroundColor: Colors.red
  },
  facebook: {
    margin: 0,
    backgroundColor: Colors.facebookBlue
  },
  loginWrapper: {
    justifyContent: 'center',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Metrics.baseMargin
  },
  loginText: {
    color: Colors.snow,
    fontWeight: '600',
    fontSize: 13
  },
  tosText: {
    ...Fonts.style.tos,
  }
})
