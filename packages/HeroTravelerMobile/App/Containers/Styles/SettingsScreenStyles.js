import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.lightGreyAreas,
  },
  separator: {
    height: 35,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: Colors.navBarText,
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.navBarText,
    backgroundColor: Colors.snow,
  },
  row: {
    padding: Metrics.doubleBaseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 15,
    color: Colors.grey,
    fontWeight: '300',
    flexGrow: 2,
    marginLeft: Metrics.baseMargin,
  },
  isConnectedText: {
    color: Colors.red,
    marginRight: Metrics.baseMargin,
  },
  settingsLabel: {
    fontWeight: '900',
    fontSize: 16,
    marginHorizontal: 30,
    marginTop: 50,
    marginBottom: 10,
  },
  version: {
    marginTop: Metrics.section,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 8,
    fontFamily: Fonts.type.montserrat,
    color: Colors.navBarText,
  },
  spinner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})
