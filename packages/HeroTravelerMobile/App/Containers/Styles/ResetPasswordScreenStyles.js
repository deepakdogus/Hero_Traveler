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
    color: Colors.red
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
  loginButtonWrapper: {
    flex: 1
  },
  loginButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    backgroundColor: Colors.panther,
    padding: 6
  },
  twitter: {
    marginTop: 0,
    backgroundColor: Colors.twitterBlue
  },
  facebook: {
    margin: 0,
    backgroundColor: Colors.facebookBlue
  },
  forgotWrapper: {
    marginTop: Metrics.marginVertical
  },
  forgot: {
    textAlign: 'center',
    color: Colors.snow,
  },
  tos: {
    marginTop: Metrics.marginVertical,
    marginLeft: Metrics.section,
    marginRight: Metrics.section
  },
  submit: {
    marginTop: 40,
  }
})
