import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginHorizontal: Metrics.doubleBaseMargin
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: Metrics.section,
  },
  fieldWrapper: {
    borderBottomColor: Colors.navBarText,
    borderBottomWidth: 1,
    marginVertical: Metrics.baseMargin,
    flexDirection: 'row',
    // justifyContent: 'flex-start'
    alignItems: 'center'
  },
  fieldLabel: {
    marginBottom: Metrics.baseMargin / 2,
    fontSize: 12
  },
  fieldIcon: {
    marginRight: Metrics.doubleBaseMargin,
    width: 18,
  },
  inputStyle: {
    flexGrow: 1,
    color: Colors.background,
    fontSize: 16,
    height: 30
  },
  radioGroup: {
    marginLeft: Metrics.section,
    flexDirection: 'row',
    flex: 1
  },
  radio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Metrics.baseMargin / 5,
  },
  radioText: {
    marginLeft: Metrics.baseMargin,
    fontWeight: 'bold'
  },
  finishButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  finishButton: {
    flex: .45,
    marginHorizontal: 0
  },
  draftButton: {
    borderColor: Colors.red,
    borderWidth: 1,
    backgroundColor: Colors.clear,
  },
  draftButtonText: {
    color: Colors.red
  }
})
