import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    paddingTop: Metrics.navBarHeight,
    backgroundColor: Colors.windowTint
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
    marginTop: Metrics.marginVertical,
    color: Colors.snow,
    textAlign: 'center'
  },
  instructions: {
    ...Fonts.style.instructions,
    marginTop: Metrics.marginVertical,
    textAlign: 'center'
  },
  error: {
    marginTop: Metrics.marginVertical,
    marginBottom: -25.5,
    color: Colors.errorRed,
    fontSize: 12,
    textAlign: 'center'
  },
  errorView: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: -20
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
  form: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  submitButton: {
    marginTop: Metrics.baseMargin*2
  },
  tos: {
    marginTop: Metrics.marginVertical,
    marginLeft: Metrics.section,
    marginRight: Metrics.section
  }
})
