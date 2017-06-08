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
  },
  fieldLabel: {
    marginBottom: Metrics.baseMargin / 2,
    fontSize: 14
  },
  fieldIcon: {
    marginRight: Metrics.doubleBaseMargin,
    width: 18,
  },
  inputStyle: {
    flexGrow: 1,
    color: Colors.background,
    fontSize: 16,
    marginBottom: 10,
    height: 30
  },
  tagStyle: {
    flexGrow: 1,
    color: Colors.background,
    fontSize: 16,
    minHeight: 30
  },
  tagStyleText: {
    fontSize: 16,
    color: Colors.background,
    marginBottom: 20
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
    marginBottom: Metrics.baseMargin,
  },
  radioText: {
    marginLeft: Metrics.baseMargin,
    fontWeight: '500',
    fontSize: 16,

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
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  videoDescriptionWrapper: {
    borderColor: Colors.navBarText,
    borderWidth: 1,
    padding: Metrics.baseMargin,
    marginBottom: Metrics.section
  },
  videoDescription: {
    height: 100,
    color: Colors.background,
    fontSize: 16,
  }
})
