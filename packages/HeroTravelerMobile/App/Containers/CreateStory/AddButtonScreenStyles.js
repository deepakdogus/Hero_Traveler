import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  containerWithNavbar: {
    ...ApplicationStyles.screen.containerWithNavbar,
  },
  navBarStyle: {
    height: '11%',
    paddingTop: isIPhoneX() ? 20 : 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.feedDividerGrey,
  },
  content: {
    marginHorizontal: Metrics.doubleBaseMargin,
  },
  labelRow: {
    marginTop: Metrics.doubleBaseMargin * 2,
    marginBottom: Metrics.baseMargin,
  },
  label: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  buttonContainer: {},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.navBarText,
    borderBottomWidth: 1,
  },
  buttonText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.background,
  },
  errorRow: {
    paddingVertical: Metrics.baseMargin,
  },
  errorText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.redHighlights,
  },
  deleteButton: {
    marginVertical: Metrics.doubleBaseMargin,
  },
  deleteText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.redHighlights,
  },
})
