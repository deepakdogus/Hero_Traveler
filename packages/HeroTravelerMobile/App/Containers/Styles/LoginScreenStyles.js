import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    paddingTop: Metrics.navBarHeight,
    backgroundColor: Colors.windowTint,
  },
  spinner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  socialText: {
    fontFamily: Fonts.type.montserrat
  },
  socialTextBold: {
    fontWeight: '800'
  },
  textInputReadonly: {
    ...Fonts.style.inputLabels,
    height: 40,
    color: Colors.steel
  },
  title: {
    ...Fonts.style.title,
    color: Colors.snow,
    textAlign: 'center'
  },
  instructions: {
    ...Fonts.style.instructions,
    marginTop: Metrics.marginVertical,
    textAlign: 'center'
  },
  error: {
    marginTop: Metrics.baseMargin*2,
    marginBottom: -10,
    color: Colors.errorRed,
    fontSize: 12,
    textAlign: 'center'
  },
  form: {
    marginTop: Metrics.marginVertical,
  },
  inputContainer: {
    flex: 1,
    height: 40,
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
    marginTop: Metrics.marginVertical,
    marginBottom: Metrics.marginVertical,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteAlphaPt3,
    borderStyle: 'solid'
  },
  input: {
    ...Fonts.style.inputLabels,
    height: 40,
    color: Colors.snow
  },
  loginButton: {
    marginTop: 40,
  },
  twitter: {
    marginTop: 0,
    backgroundColor: Colors.twitterBlue
  },
  facebook: {
    margin: 30,
    backgroundColor: Colors.facebookBlue
  },
  forgotWrapper: {
    marginTop: Metrics.marginVertical
  },
  forgot: {
    textAlign: 'center',
    color: Colors.snow,
    fontSize: 15
  },
  tos: {
    marginTop: Metrics.marginVertical,
    marginLeft: Metrics.section,
    marginRight: Metrics.section
  }
})
