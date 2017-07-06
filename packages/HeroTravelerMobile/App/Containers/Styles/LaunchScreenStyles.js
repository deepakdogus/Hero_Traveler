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
  emailTextStyle: {
    width: '85%',
    textAlign: 'center',
    paddingTop: 3,
    fontFamily: Fonts.type.base,
    marginLeft: '-12%',
    marginRight: 0,
    backgroundColor: 'transparent'
  },
  facebook: {
    margin: 0,
    backgroundColor: Colors.facebookBlue,
    flexDirection: 'row',
  },
  facebookIcon: {
    marginTop: 10,
    paddingLeft: 22,
  }, 
  facebookTextStyle: {
    width: '85%',
    textAlign: 'center',
    paddingTop: 3,
    fontFamily: Fonts.type.base,
    marginLeft: '-5%',
    marginRight: '0%',
    backgroundColor: 'transparent'
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
  }
})
