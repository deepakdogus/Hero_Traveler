import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  navBar: {
    height: Metrics.navBarHeight,
    paddingTop: isIPhoneX ? Metrics.baseMargin + 10 : Metrics.baseMargin,
    backgroundColor: Colors.background,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navButton: {
    marginTop: 20,
  },
  root: {
    backgroundColor: Colors.background,
  },
  header: {
    marginBottom: Metrics.section,
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.snow,
  },
  subtitle: {
    ...Fonts.style.instructions,
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  inputContainer: {
    flexShrink: 1,
    height: 40,
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
    marginTop: Metrics.marginVertical,
    marginBottom: Metrics.marginVertical,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteAlphaPt3,
    borderStyle: 'solid',
  },
  inputContainerNoBorder: {
    flexShrink: 1,
    height: 40,
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
    marginTop: Metrics.marginVertical,
    marginBottom: Metrics.marginVertical,
  },
  input: {
    ...Fonts.style.inputLabels,
    height: 40,
    flexShrink: 1,
    color: Colors.snow,
  },
  error: {
    marginTop: Metrics.marginVertical,
    marginBottom: -25.5,
    color: Colors.errorRed,
    fontSize: 12,
    textAlign: 'center',
  },
  errorView: {
    position: 'absolute',
    right: 0,
    bottom: 55,
  },
  dateWrapper: {
    position: 'absolute',
    top: 250,
    left: 40,
    elevation: 100,
  },
  dateView: {
    backgroundColor: 'white',
    height: 300,
    width: 300,
  },
  radioGroup: {
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
  },
  radioButtonContainer: {
    paddingTop: 5,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioWithTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioTextInputContainer: {
    marginTop: 5,
    flex: 1,
    justifyContent: 'center',
    height: 25,
    marginLeft: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteAlphaPt3,
    borderStyle: 'solid',
  },
})
