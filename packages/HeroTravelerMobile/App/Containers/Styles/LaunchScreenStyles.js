import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Shared/Themes/'

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
    fontSize: 20,
    color: Colors.snow,
    textAlign: 'center',
    fontWeight: '300',
    width: 200
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
    backgroundColor: Colors.red,
    flexDirection: 'row',
  },
  emailIcon: {
    marginTop: 16,
    paddingRight: 10,
    paddingLeft: 10,
  },
  baseTextStyle: {
    fontSize: 16,
    width: '85%',
    textAlign: 'center',
    paddingTop: 3,
    fontFamily: Fonts.type.base,
    backgroundColor: 'transparent'
  },
  emailTextStyle: {
    marginLeft: '-12%',
    marginRight: 0,
  },
  facebook: {
    margin: 0,
    backgroundColor: Colors.facebookBlue,
    flexDirection: 'row',
  },
  facebookIcon: {
    marginTop: 10,
    paddingLeft: 25,
  },
  facebookTextStyle: {
    marginLeft: '-5%',
    marginRight: '0%',
  },
  loginWrapper: {
    justifyContent: 'center',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Metrics.baseMargin
  },
  loginText: {
    color: Colors.snow,
    fontWeight: '600',
    fontSize: 15,
  },
  tosText: {
    ...Fonts.style.tos,
    fontSize: 15,
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})
